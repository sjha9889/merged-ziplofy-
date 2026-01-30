import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DiscountChooseCardList } from "../components/DiscountChooseCardList";
import GridBackgroundWrapper from "../components/GridBackgroundWrapper";

export interface DiscountCardData {
    title: string;
    desc: string;
    route: string;
}

const discountCardsData: DiscountCardData[] = [
    { title: "Amount Off Products", desc: "Count specific products or collection of products", route: "/discounts/new/amount-off-products" },
    { title: "Buy X get Y", desc: "Discount specific products or collection of products", route: "/discounts/new/buy-x-get-y" },
    { title: "Amount off order", desc: "Discount the total order amount", route: "/discounts/new/amount-off-order" },
    { title: "Free Shipping", desc: "Offer free shipping on an order", route: "/discounts/new/free-shipping" },
];

export default function SelectDiscountToCreatePage() {
    const navigate = useNavigate();

    const handleCardClick = useCallback((route: string) => {
        navigate(route);
    }, [navigate]);

    return (
        <GridBackgroundWrapper>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-base font-medium text-gray-900">Please choose the type of discount you want to create</h2>
                        <DiscountChooseCardList discountCardsData={discountCardsData} onCardClick={handleCardClick} />
                    </div>
                </div>
            </div>
        </GridBackgroundWrapper>
    );
}
