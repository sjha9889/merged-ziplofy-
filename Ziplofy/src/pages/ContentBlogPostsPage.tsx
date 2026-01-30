import { useNavigate } from "react-router-dom";
import GridBackgroundWrapper from "../components/GridBackgroundWrapper";

export const ContentBlogPostsPage = () => {
  const navigate = useNavigate();
  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-medium text-gray-900">Blog posts</h1>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Manage Blogs
              </button>
              <button 
                onClick={() => navigate("/content/blog-posts/new")} 
                className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                + Create Blog
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="w-full border border-gray-200 min-h-[400px] flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2">
              <span className="text-base font-medium text-gray-900">Write a blog post</span>
              <span className="text-xs text-gray-600">Blog posts are a great way to build a community around your products and your brand.</span>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
                <button className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                  Manage Blogs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  )
}
