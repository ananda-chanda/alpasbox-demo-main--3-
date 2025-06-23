import React, { useState, useEffect } from 'react';
import axios from 'axios';
import vendortik from '../assets/blog/vendor-tik.png';

const PlanContent = () => {
  const [planData, setPlanData] = useState({
    activePlan: null,
    deactivePlan: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const authToken = localStorage.getItem("vendor_token");
        const response = await axios.post('https://admin.urbantyohar.com/api/my-plan', {}, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json'
          }
        });
        setPlanData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, []);

  const extractFeatures = (htmlString) => {
    const div = document.createElement('div');
    div.innerHTML = htmlString || '';
    const items = div.getElementsByTagName('li');
    return Array.from(items).slice(0, 3).map(item => {
      const hasStrong = item.getElementsByTagName('strong').length > 0;
      return {
        text: item.textContent,
        isBlurred: hasStrong
      };
    });
  };

  if (loading) return <div className="p-2">Loading...</div>;
  if (error) return <div className="p-2 text-red-500">Error: {error}</div>;

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold">My Plan</h1>
      <div className="w-full max-w-6xl mx-auto p-6 mt-0">
        {/* Active Plan Card */}
        <div className="h-40 relative bg-white rounded-xl mb-10 p-1 flex items-center justify-between">
          {/* Left Side - Plan Name */}
          <div className="flex items-center justify-center bg-purple-700 text-white px-6 py-2 font-bold w-50 h-40 text-center text-2xl">
            <p>{planData.activePlan?.title}</p>
          </div>
          {/* Right Side - Plan Details */}
          <div className="bg-yellow-400 p-6 text-start h-40 w-full">
            <div className="flex flex-col space-y-2">
              {extractFeatures(planData.activePlan?.features).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img src={vendortik} alt="tick" className="w-4 h-4" />
                  <p className={`text-lg font-light text-gray-800 ${feature.isBlurred ? 'blur-[2px]' : ''}`}>
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid md:grid-cols-3 gap-8 px-24">
          {/* Active Plan Image */}
          {/* <div className="rounded-xl shadow-xl overflow-hidden flex justify-center">
            <div className="w-80 h-80">
              <img
                src={`https://admin.urbantyohar.com/${planData.activePlan?.plan_image}`}
                alt="Current Plan"
                className="w-full h-full object-contain"
              />
              <div className="bg-green-500 text-white text-center py-2">
                Current Plan
              </div>
            </div>
          </div> */}

          {/* Deactive Plan Images */}
          {planData.deactivePlan?.slice(0, 2).map((plan, index) => (
            <div key={plan.id} className="rounded-xl  overflow-hidden flex justify-center">
              <div className="w-full h-full ">
                <img
                  src={`https://admin.urbantyohar.com/${plan.plan_image}`}
                  alt={`Plan ${plan.title}`}
                  className="w-full h-full object-contain "
                />
                <div className="bg-gray-500 text-white text-center py-2">
                  {plan.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanContent;