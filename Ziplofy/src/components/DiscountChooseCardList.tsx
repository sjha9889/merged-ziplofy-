import { useCallback } from "react";
import { DiscountCardData } from "../pages/SelectDiscountToCreatePage";
import DiscountChooseCard from "./DiscountChooseCard";

type PropTypes = {
    discountCardsData: DiscountCardData[];
    onCardClick: (route: string) => void;
}

export const DiscountChooseCardList = ({ discountCardsData, onCardClick }: PropTypes) => {
    const handleCardClick = useCallback((route: string) => {
        onCardClick(route);
    }, [onCardClick]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {
                discountCardsData.map((cardData, index) => (
                    <DiscountChooseCard
                        key={index}
                        title={cardData.title}
                        desc={cardData.desc}
                        route={cardData.route}
                        onClick={handleCardClick}
                    />
                ))
            }
        </div>
    );
}
