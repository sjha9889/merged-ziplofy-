import React, { useState } from "react";
import { Search, Check, X } from "lucide-react";
import "./MembershipPlan.css";

interface Feature {
  name: string;
  included: boolean;
}

interface Plan {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: Feature[];
  isPopular?: boolean;
}

const MembershipPlan: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans: Plan[] = [
    {
      name: "Monthly Plan",
      priceMonthly: 499,
      priceYearly: 4990,
      description: "For most businesses that want to optimize web queries",
      features: [
        { name: "500 Orders", included: true },
        { name: "Unlock every feature", included: true },
        { name: "Custom integrations", included: true },
        { name: "24/7 Support", included: true },
        { name: "Fast processing", included: false },
        { name: "Modern Landing Page", included: true },
        { name: "Single Product Landing Page", included: true },
      ],
    },
    {
      name: "Monthly Plan",
      priceMonthly: 999,
      priceYearly: 9990,
      description: "For most businesses that want to optimize web queries",
      features: [
        { name: "1000 Orders", included: true },
        { name: "Unlock every feature", included: true },
        { name: "Custom integrations", included: true },
        { name: "24/7 Support", included: true },
        { name: "Fast processing", included: true },
        { name: "Modern Landing Page", included: true },
        { name: "Single Product Landing Page", included: true },
      ],
    },
    {
      name: "Monthly Plan",
      priceMonthly: 1599,
      priceYearly: 15990,
      description: "For most businesses that want to optimize web queries",
      features: [
        { name: "Unlimited order", included: true },
        { name: "Unlock every feature", included: true },
        { name: "Custom integrations", included: true },
        { name: "24/7 Support", included: true },
        { name: "Fast processing", included: true },
        { name: "Modern Landing Page", included: true },
        { name: "Single Product Landing Page", included: true },
      ],
      isPopular: true,
    },
  ];

  const filteredPlans = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="membership-plans-page">
      {/* Header */}
      <div className="mp-header">
        <h1 className="mp-title">Membership Plans</h1>
        <div className="mp-search">
          <Search size={18} className="mp-search-icon" />
          <input
            type="text"
            placeholder="Search plans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mp-search-input"
          />
        </div>
      </div>

      {/* Plan selection section */}
      <div className="mp-section">
        <h2 className="mp-section-title">
          Select the <span className="mp-highlight">best plan</span> for your needs
        </h2>
        <div className="mp-toggle">
          <span className={`mp-toggle-label ${billingCycle === "monthly" ? "active" : ""}`}>
            Monthly Plan
          </span>
          <button
            className={`mp-toggle-switch ${billingCycle === "yearly" ? "yearly" : ""}`}
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          >
            <span className="mp-toggle-thumb" />
          </button>
          <span className={`mp-toggle-label ${billingCycle === "yearly" ? "active" : ""}`}>
            Yearly Plan
          </span>
        </div>
      </div>

      {/* Plans grid */}
      <div className="mp-cards">
        {filteredPlans.map((plan, idx) => (
          <div
            key={idx}
            className={`mp-card ${plan.isPopular ? "mp-card-popular" : ""}`}
          >
            {plan.isPopular && <div className="mp-popular-tag">Most Popular</div>}
            <div className="mp-card-header">
              <h3 className="mp-card-title">{plan.name}</h3>
              <p className="mp-card-desc">{plan.description}</p>
              <div className="mp-card-price">
                <span className="mp-price-amount">₹{billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly}</span>
                <span className="mp-price-period">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>
            </div>
            <button className={`mp-active-btn ${plan.isPopular ? "mp-active-btn-solid" : ""}`}>
              Active Plan
            </button>
            <ul className="mp-features">
              {plan.features.map((f, i) => (
                <li key={i} className="mp-feature">
                  {f.included ? (
                    <Check size={18} className="mp-feature-check" />
                  ) : (
                    <X size={18} className="mp-feature-x" />
                  )}
                  <span>{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlan;
