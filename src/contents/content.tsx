import type { PlasmoCSConfig } from "plasmo"
import styleText from "data-text:./style.css"
import type { PlasmoGetStyle } from "plasmo"
import logo from 'data-base64:~assets/icon.development.png'
import { MySearchProvider, useSearchContext } from "~context/SearchContext"
import React from 'react'

// export const getStyle: PlasmoGetStyle = () => {
//   const style = document.createElement("style")
//   style.textContent = styleText
//   return style
// }

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
    all_frames: true,
    world: "MAIN"
}


const CustomButton = () => {
  const {getHTMLData, trigger, pageData} = useSearchContext()
  const [inf, setInf] = React.useState(false)
  const handleMessage = (message, sender, sendResponse) => {
    if (message.action === 'amazon_opened') {
      console.log('Message received in content.jsx:', message);
    }
  }
  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage)
    setInf(inf => !inf)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [inf])
  React.useEffect(() => {
    console.log('PAGE DATAAAA', pageData, trigger)
  }, [pageData, trigger])
    return (
      <MySearchProvider>
        {trigger && <div style={{backgroundColor: "white", borderRadius: "50%", padding: "0 5px 0 5px"}}>
            <img className='!w-[35px]' style={{width: "35px"}} src={logo} alt="logo"  />
        </div>}
      </MySearchProvider>
    )
  }
   
  export default CustomButton