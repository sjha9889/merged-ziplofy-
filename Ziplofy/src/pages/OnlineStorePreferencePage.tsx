import { useCallback, useState } from "react"
import GridBackgroundWrapper from "../components/GridBackgroundWrapper";
import Modal from "../components/Modal";

type Tab = "All" | "Active" | "Expired"


export default function OnlineStorePreferencePage() {

    const [passwordInput,setPasswordInput] = useState<string>("")
    const [messageToYourVisitorsInput,setMessageToYourVisitorsInput] = useState<string>("")
    const [homePageTitleInput,sethomePageTitleInput] = useState<string>("")
    const [metaDescription,setMetaDescription] = useState<string>("")
    const [activeTab,setActiveTab] = useState<Tab>("All");

    const [createNewSignatureModalOpen,setCreateNewSignatureModalOpen] = useState<boolean>(false);

    const [signatureInput,setSignatureInput] = useState<string>("");
    const [domainInput,setDomainInput] = useState<string>("");
    const [expiresInInput,setExpiresInInput] = useState<string>("")


    const handleChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
        setPasswordInput(e.target.value)
    },[])

    const handleMessageToYourVisitorsInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setMessageToYourVisitorsInput(e.target.value)
    },[])

    const handleHomePageTitleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
        sethomePageTitleInput(e.target.value)
    },[])

    const handleMetaDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setMetaDescription(e.target.value)
    },[])

    const handleChangeActiveTab = useCallback((tab:Tab)=>{
        setActiveTab(tab)
    },[])

    const handleToggleNewSignatureModal = useCallback(()=>{
        setCreateNewSignatureModalOpen(prev=>!prev)
    },[])
    
    const handleSignatureInputChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        setSignatureInput(e.target.value)
    },[])

    const handleDomainInputChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        setDomainInput(e.target.value)
    },[])

    const handleExpiresInInputChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        setExpiresInInput(e.target.value)
    },[])

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-xl font-medium text-gray-900">Store Preferences</h1>
        </div>

        {/* Store Access */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 p-4 flex flex-col gap-4">
            <h2 className="text-sm font-medium text-gray-900">Store Access</h2>
            <div className="border border-gray-200 p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-900">Password protection</p>
                <span className="text-xs text-gray-500">Restrict access to visitors with the password</span>
              </div>
              <span className="text-xs text-gray-500 bg-white/95 p-3">To let anyone access your online store, pick a plan and then remove your password</span>
            </div>

            <div className="flex flex-col bg-white/95 p-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-900">Password</span>
                <input 
                  value={passwordInput} 
                  onChange={handleChangePassword} 
                  className="px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400" 
                  type="text" 
                />
                <span className="text-xs text-gray-500">{`${passwordInput.length} of 100 characters used`}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-900">Message to your visitors</span>
                <textarea 
                  value={messageToYourVisitorsInput} 
                  onChange={handleMessageToYourVisitorsInputChange} 
                  className="px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                  rows={3}
                />
                <span className="text-xs text-gray-500">{`${messageToYourVisitorsInput.length} of 5,000 characters used`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Sharing Image and SEO */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 p-4 flex flex-col gap-4">
            <h2 className="text-sm font-medium text-gray-900">Social Sharing Image and SEO</h2>

            <div className="flex gap-4">
              {/* Left - Image Upload */}
              <div className="border border-gray-200 flex flex-col flex-1">
                <div className="flex justify-center items-center flex-col p-8 bg-white/95 border-b border-gray-200">
                  <span className="text-sm text-gray-900 mb-1">Add Image</span>
                  <span className="text-xs text-gray-500">Recommended: 1200 x 628 pixels</span>
                </div>
                <div className="p-4">
                  <span className="text-xs text-gray-600">VSJIksjkfjoasfd.myZiplofy.com</span>
                </div>
              </div>

              {/* Right - SEO Fields */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-900">Home Page title</span>
                  <input 
                    className="px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400" 
                    value={homePageTitleInput} 
                    onChange={handleHomePageTitleInputChange} 
                    type="text"
                  />
                  <span className="text-xs text-gray-500">{`${homePageTitleInput.length} of 70 characters used`}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-900">Meta Description</span>
                  <textarea 
                    className="px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
                    rows={3}
                    value={metaDescription} 
                    onChange={handleMetaDescriptionChange}
                  />
                  <span className="text-xs text-gray-500">{`${metaDescription.length} of 320 characters used`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Automatic Redirection */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 p-4 flex flex-col gap-4">
            <h2 className="text-sm font-medium text-gray-900">Automatic Redirection</h2>
            <div className="flex flex-col gap-2">
              <div className="w-full border border-gray-200 px-4 py-3 flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-gray-900">Country/Region</span>
                  <span className="text-xs text-gray-500">Displays a storefront that matches the visitor's location</span>
                </div>
                <button className="text-xs text-gray-500">Toggle</button>
              </div>
              <div className="w-full border border-gray-200 px-4 py-3 flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-gray-900">Language</span>
                  <span className="text-xs text-gray-500">Displays the language that matches a visitor's browser, when available</span>
                </div>
                <button className="text-xs text-gray-500">Toggle</button>
              </div>
            </div>
          </div>
        </div>

        {/* Spam Protection */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium text-gray-900">Spam Protection</h2>
              <span className="text-xs text-gray-500">Enabling hCaptcha can protect your store from spam. Some customers may need to complete the hCaptcha task.</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center border border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-900">Enable on contact and comment forms</span>
                <button className="text-xs text-gray-500">Toggle</button>
              </div>
              <div className="flex justify-between items-center border border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-900">Enable on login, create account and password recovery pages</span>
                <button className="text-xs text-gray-500">Toggle</button>
              </div>
            </div>
          </div>
        </div>

        {/* Crawler Access */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 p-4 flex gap-4 flex-col">
            <h2 className="text-sm font-medium text-gray-900">Crawler Access</h2>
            <div className="flex justify-between gap-4">
              <p className="text-xs text-gray-500 flex-1">Authorize external tools to crawl your store. Use the buttons to copy the full values for Signature, Signature-input, and Signature-Agent, then paste them into your http crawler requests.</p>
              <button 
                onClick={handleToggleNewSignatureModal} 
                className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50"
              >
                Create signature
              </button>
            </div>
            <div className="border border-gray-200 flex flex-col">

              {/* Tabs Section */}
              <div className="w-full border-b border-gray-200 flex gap-2 p-3">
                <span 
                  onClick={()=>handleChangeActiveTab("All")} 
                  className={`text-xs px-2 py-1 cursor-pointer ${activeTab==="All"?"bg-gray-50 text-gray-900":"text-gray-500"}`}
                >
                  All
                </span>
                <span 
                  onClick={()=>handleChangeActiveTab("Active")} 
                  className={`text-xs px-2 py-1 cursor-pointer ${activeTab==="Active"?"bg-gray-50 text-gray-900":"text-gray-500"}`}
                >
                  Active
                </span>
                <span 
                  onClick={()=>handleChangeActiveTab("Expired")} 
                  className={`text-xs px-2 py-1 cursor-pointer ${activeTab==="Expired"?"bg-gray-50 text-gray-900":"text-gray-500"}`}
                >
                  Expired
                </span>
              </div>

              {/* Main Area */}
              <div className="bg-white/95 flex flex-col justify-center items-center gap-2 p-8 min-h-[300px]">
                <div className="flex flex-col gap-2 justify-center items-center">
                  <span className="text-sm text-gray-900">Manage Crawler Access</span>
                  <span className="text-xs text-gray-500">Create Signatures that allows trusted tools to crawl your store</span>
                  <button 
                    onClick={handleToggleNewSignatureModal} 
                    className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 mt-2"
                  >
                    Create Signature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Signature Modal */}
      <Modal
        open={createNewSignatureModalOpen}
        onClose={handleToggleNewSignatureModal}
        title="Create new signature"
        maxWidth="md"
        actions={
          <>
            <button 
              onClick={handleToggleNewSignatureModal} 
              className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800">
              Create Signature
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <span className="text-xs text-gray-500">These details can't be changed after the signature is created</span>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-900">Signature name</span>
              <input 
                value={signatureInput} 
                onChange={handleSignatureInputChange} 
                type="text" 
                className="px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
              <span className="text-xs text-gray-500">{`${signatureInput.length} of 100 characters used`}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-900">Domain</span>
              <input 
                value={domainInput} 
                onChange={handleDomainInputChange} 
                type="text" 
                className="px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-900">Expires In</span>
              <input 
                value={expiresInInput} 
                onChange={handleExpiresInInputChange} 
                type="text" 
                className="px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
              <span className="text-xs text-gray-500">Expires on Dec 25, 2025</span>
            </div>
          </div>
        </div>
      </Modal>
    </GridBackgroundWrapper>
  )
}
