import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import Table from "~features/table"
import "~base.css"
import "~style.css"
import Similiar from "~features/similiar"
import Same from "~features/same"
import { title } from "process"
 
export const config: PlasmoCSConfig = {
  matches: [
    "http://www.amazon.com/*",
    "https://www.amazon.com/*",
    "http://smile.amazon.com/*",
    "https://smile.amazon.com/*",
    "https://www.amazon.ca/*",
    "https://www.amazon.co.uk/*",
    "http://www.amazon.it/*",
    "https://www.amazon.it/*",
    "https://www.amazon.fr/*",
    "https://www.amazon.es/*",
    "https://www.amazon.in/*"
  ],
  all_frames: true
}



function IndexPopup() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState('/')
  useEffect(() => {
    console.log('use effect is run')
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const getHTMLData = async(tab) => {
        try {
            if (tab) {
              const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const productTitle = document.querySelector('#productTitle').innerHTML
                    console.log(productTitle)
                    const price = `${document.querySelector('.a-price-symbol').innerHTML} ${document.querySelector('.a-price-whole').innerHTML}`
                    console.log(price)
                    
                    const image = document.querySelector('#landingImage') != null ? document.querySelector('#landingImage').getAttribute('src') : document.querySelector("img.a-dynamic-image").getAttribute('src')
                    console.log(image)
                    const feature = document.querySelector('#feature-bullets').innerHTML
                    console.log(feature)
                    const details = document.querySelector('#detailBullets_feature_div').innerHTML
                    console.log(details)
                    return [productTitle.replace(/ {2,}/g, ''), price, image, feature, details]
                }
              });
              const data = result.result;
              console.log("your data: ",data)
              chrome.storage.local.set({ 'data': data })
              setData(data)
            }
        } catch (error) {
            console.log(error)
        }
      }
      if (currentTab) {
        console.log('Popup clicked - Tab', currentTab);
        getHTMLData(currentTab);
      }
    });
  }, [])
  const renderContent = () => {
      if(page == '/'){
          return <Table data={data} />
      }else if(page == '/similiar'){
          return <Similiar data={data} />
      }else if(page == '/same'){
        return <Same data={data} />
    }
  }
  return (
    <>
      {renderContent()}
      {page == "/" ? 
        <div className="flex py-5">
          <button onClick={() => setPage('/similiar')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>View similiar products</button>
          <button onClick={() => setPage('/same')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>View Same products</button>
        </div>
      : page == "/similiar" ?
        <div className="flex py-5">
          <button onClick={() => setPage('/')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>Go back</button>
        </div>
      : page == "/same" ?
        <div className="flex py-5">
          <button onClick={() => setPage('/')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>Go back</button>
        </div>
      :
        <div className="flex py-5">
          <button onClick={() => setPage('/')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>Home</button>
        </div>

      }
    </>
  )
}

export default IndexPopup