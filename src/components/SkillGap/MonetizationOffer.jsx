import React, { useState } from 'react';
import { Check, Star, Zap, Award } from 'lucide-react';

const MonetizationOffer = ({ offer }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getOfferIcon = () => {
    const title = offer.offer_title;
    if (title.includes('Transition')) return Zap;
    if (title.includes('Booster')) return Star;
    if (title.includes('Interview')) return Award;
    return Check;
  };

  const Icon = getOfferIcon();

  const getColor = () => {
    const title = offer.offer_title;
    if (title.includes('Transition')) {
      return {
        bg: 'from-red-600/20 to-red-400/10 border-red-600/50',
        accent: 'text-red-400',
        button: 'from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/30',
      };
    }
    if (title.includes('Booster')) {
      return {
        bg: 'from-yellow-600/20 to-yellow-400/10 border-yellow-600/50',
        accent: 'text-yellow-400',
        button: 'from-yellow-600 to-yellow-500 hover:shadow-lg hover:shadow-yellow-500/30',
      };
    }
    return {
      bg: 'from-green-600/20 to-green-400/10 border-green-600/50',
      accent: 'text-green-400',
      button: 'from-green-600 to-green-500 hover:shadow-lg hover:shadow-green-500/30',
    };
  };

  const colors = getColor();

  return (
    <div className={`bg-gradient-to-r ${colors.bg} border rounded-2xl p-8 relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <Icon size={200} className="absolute -top-20 -right-20" />
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8">
        {/* Left side - Offer details */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-full bg-[#FFF4E0] border border-border`}>
              <Icon size={28} className={colors.accent} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Personalized Package For You
              </p>
              <h3 className={`text-2xl font-bold mt-2 ${colors.accent}`}>
                {offer.offer_title}
              </h3>
              <p className="text-foreground mt-2">
                {offer.offer_description}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6 p-4 bg-[#FFF4E0] border border-border rounded-lg">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Recommended Price
            </p>
            <p className={`text-3xl font-bold ${colors.accent}`}>
              ₹{offer.estimated_price.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              One-time payment
            </p>
          </div>

          {/* Call to action */}
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full bg-gradient-to-r ${colors.button} text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2`}
          >
            <Zap size={20} />
            {offer.call_to_action}
          </button>
        </div>

        {/* Right side - What's included */}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
            What's Included
          </p>
          <div className="space-y-3">
            {offer.included_items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className={`flex-shrink-0 mt-0.5 p-1 rounded-full bg-[#FFF4E0] border border-border`}>
                  <Check size={16} className={colors.accent} />
                </div>
                <p className="text-foreground flex-1">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Star size={16} className="text-yellow-400" />
              <span>
                Trusted by <strong>1000+</strong> learners in India
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground mt-2">
              <Award size={16} className={colors.accent} />
              <span>
                <strong>30-day</strong> money-back guarantee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom message */}
      <div className="mt-8 pt-6 border-t border-border text-center text-sm text-foreground">
        <p>
          Limited offer for learners with your readiness level. This personalized package is tailored 
          to your current skill level and career goals.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Questions? Reach out to our career advisors
        </p>
      </div>
    </div>
  );
};

export default MonetizationOffer;
