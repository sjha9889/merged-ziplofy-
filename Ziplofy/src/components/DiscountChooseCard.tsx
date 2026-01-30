import { useCallback } from "react";

type PropTypes = {
    title: string;
    desc: string;
    route: string;
    onClick: (route: string) => void;
}

export default function DiscountChooseCard({ title, desc, route, onClick }: PropTypes) {
    const handleClick = useCallback(() => {
        onClick(route);
    }, [route, onClick]);

    return (
        <div className="border border-gray-200 p-4 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                    <p className="text-xs text-gray-600">{desc}</p>
                </div>
                <button
                    onClick={handleClick}
                    className="bg-gray-900 text-white px-3 py-1.5 hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    Apply Discount
                </button>
            </div>
        </div>
    );
}
