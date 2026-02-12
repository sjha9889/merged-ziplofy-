import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DiscountChooseCardList } from "../components/DiscountChooseCardList";

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
        <div className="min-h-screen bg-page-background-color">
            <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Create Discount</h1>
                        <p className="text-sm text-gray-600 mt-1">Please choose the type of discount you want to create</p>
                    </div>
                    <DiscountChooseCardList discountCardsData={discountCardsData} onCardClick={handleCardClick} />
                </div>
            </div>
        </div>
    );
}
