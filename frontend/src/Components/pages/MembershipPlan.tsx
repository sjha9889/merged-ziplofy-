import React, { useState } from "react";
import "./MembershipPlan.css";

// Define TypeScript interfaces
interface Feature {
  name: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: number;
  features: Feature[];
}

const MembershipPlan: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const plans: Plan[] = [
    {
      name: "Basic",
      price: billingCycle === "monthly" ? 50 : 500,
      features: [
        { name: "10 Contacts", included: true },
        { name: "10 Leads", included: true },
        { name: "20 Companies", included: true },
        { name: "50 Campaigns", included: true },
        { name: "100 Projects", included: true },
        { name: "Deals", included: false },
        { name: "Tasks", included: false },
        { name: "Pipelines", included: false },
      ],
    },
    {
      name: "Business",
      price: billingCycle === "monthly" ? 200 : 2000,
      features: [
        { name: "20 Contacts", included: true },
        { name: "20 Leads", included: true },
        { name: "50 Companies", included: true },
        { name: "Unlimited Campaigns", included: true },
        { name: "Unlimited Projects", included: true },
        { name: "Deals", included: false },
        { name: "Tasks", included: false },
        { name: "Pipelines", included: false },
      ],
    },
    {
      name: "Enterprise",
      price: billingCycle === "monthly" ? 400 : 4000,
      features: [
        { name: "Unlimited Contacts", included: true },
        { name: "Unlimited Leads", included: true },
        { name: "Unlimited Companies", included: true },
        { name: "Unlimited Campaigns", included: true },
        { name: "Unlimited Projects", included: true },
        { name: "Deals", included: true },
        { name: "Tasks", included: true },
        { name: "Pipelines", included: true },
      ],
    },
  ];

  return (
    <div className="membership-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1 className="title">Membership Plans</h1>
          <div className="header-actions">
            <button className="icon-btn">
              <span className="icon">⚙️</span>
            </button>
            <button className="icon-btn">
              <span className="icon">↗️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Add Button */}
        <div className="top-controls">
          <div className="search-container">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search Plan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: "40px",
                paddingRight: "16px",
                paddingTop: "8px",
                paddingBottom: "8px",
                width: "320px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
          <button className="add-btn">
            <span className="btn-icon">{/* Add SVG from public folder here */}</span>
            Add Membership
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle-container">
          <div className="billing-toggle">
            <span className={`billing-label ${billingCycle === "monthly" ? "active" : ""}`}>
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")
              }
              className={`toggle-switch ${billingCycle === "annually" ? "switched" : ""}`}
            >
              <span className="toggle-thumb"></span>
            </button>
            <span className={`billing-label ${billingCycle === "annually" ? "active" : ""}`}>
              Annually
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan: Plan) => (
            <div key={plan.name} className="plan-card">
              {/* Plan Header */}
              <div className="plan-header">
                <h3 className={`plan-name ${plan.name.toLowerCase()}`}>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">${plan.price}</span>
                  <span className="period">
                    / {billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="features-list">
                {plan.features.map((feature: Feature, index: number) => (
                  <div key={index} className="feature-item">
                    <div className={`feature-icon ${feature.included ? "included" : "excluded"}`}>
                      {feature.included ? "✓" : "✕"}
                    </div>
                    <span className="feature-name">{feature.name}</span>
                  </div>
                ))}
              </div>

              {/* Choose Button */}
              <button className="choose-btn">Choose</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipPlan;
