import React from 'react'
import {Link} from 'react-router-dom';

function Integration() {
  return (
    <div>
      <span className='text-[24px] font-bold ' >Integrations</span>
        <div>  
          <div className=' mt-7 ' >
              <div className='flex justify-between gap-4 ' >
                <div className='flex  ' >
                  <div className=' flex items-start p-0' >
                      <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" fill="white"/>
                      <path d="M16.5355 27.3969C16.5355 28.8856 15.3193 30.1017 13.8306 30.1017C12.3419 30.1017 11.1258 28.8856 11.1258 27.3969C11.1258 25.9081 12.3419 24.692 13.8306 24.692H16.5355V27.3969Z" fill="#E01E5A"/>
                      <path d="M17.8984 27.3969C17.8984 25.9081 19.1145 24.692 20.6032 24.692C22.0919 24.692 23.3081 25.9081 23.3081 27.3969V34.1694C23.3081 35.6581 22.0919 36.8743 20.6032 36.8743C19.1145 36.8743 17.8984 35.6581 17.8984 34.1694V27.3969Z" fill="#E01E5A"/>
                      <path d="M20.6032 16.5355C19.1145 16.5355 17.8984 15.3194 17.8984 13.8307C17.8984 12.342 19.1145 11.1259 20.6032 11.1259C22.0919 11.1259 23.3081 12.342 23.3081 13.8307V16.5355H20.6032Z" fill="#36C5F0"/>
                      <path d="M20.6032 17.8984C22.0919 17.8984 23.3081 19.1146 23.3081 20.6033C23.3081 22.092 22.0919 23.3081 20.6032 23.3081H13.8306C12.3419 23.3081 11.1258 22.092 11.1258 20.6033C11.1258 19.1146 12.3419 17.8984 13.8306 17.8984H20.6032Z" fill="#36C5F0"/>
                      <path d="M31.4645 20.6033C31.4645 19.1146 32.6806 17.8984 34.1693 17.8984C35.6581 17.8984 36.8742 19.1146 36.8742 20.6033C36.8742 22.092 35.6581 23.3081 34.1693 23.3081H31.4645V20.6033Z" fill="#2EB67D"/>
                      <path d="M30.1016 20.6033C30.1016 22.092 28.8855 23.3081 27.3968 23.3081C25.9081 23.3081 24.6919 22.092 24.6919 20.6033V13.8307C24.6919 12.342 25.9081 11.1259 27.3968 11.1259C28.8855 11.1259 30.1016 12.342 30.1016 13.8307V20.6033Z" fill="#2EB67D"/>
                      <path d="M27.3968 31.4646C28.8855 31.4646 30.1016 32.6807 30.1016 34.1694C30.1016 35.6581 28.8855 36.8743 27.3968 36.8743C25.9081 36.8743 24.6919 35.6581 24.6919 34.1694V31.4646H27.3968Z" fill="#ECB22E"/>
                      <path d="M27.3968 30.1017C25.9081 30.1017 24.6919 28.8856 24.6919 27.3969C24.6919 25.9081 25.9081 24.692 27.3968 24.692H34.1693C35.6581 24.692 36.8742 25.9081 36.8742 27.3969C36.8742 28.8856 35.6581 30.1017 34.1693 30.1017H27.3968Z" fill="#ECB22E"/>
                      </svg>

                  </div>
                  <div className='flex flex-col p-2 pl-0 gap-y-2' >
                      <h1 className='text-[20px] text-black font-bold ' >Slack</h1>
                      <ul className=' pl-6 list-disc text-gray-500 text-[14px] ' >
                        <li>Slack integrations helps you to get latest hiring updates.</li>
                        <li>Channel notifications can be turned ON/OFF based on your preferences. </li>
                      </ul>
                  </div>
                </div>
                <div className='' >
                  <button>
                  <div className=' w-[160px] h-[42px] pr-3 flex items-center justify-center border-2 border-gray-400 rounded-md ' >
                    <div>
                      <svg width="38" height="38" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" fill="white"/>
                      <path d="M16.5355 27.3969C16.5355 28.8856 15.3193 30.1017 13.8306 30.1017C12.3419 30.1017 11.1258 28.8856 11.1258 27.3969C11.1258 25.9081 12.3419 24.692 13.8306 24.692H16.5355V27.3969Z" fill="#E01E5A"/>
                      <path d="M17.8984 27.3969C17.8984 25.9081 19.1145 24.692 20.6032 24.692C22.0919 24.692 23.3081 25.9081 23.3081 27.3969V34.1694C23.3081 35.6581 22.0919 36.8743 20.6032 36.8743C19.1145 36.8743 17.8984 35.6581 17.8984 34.1694V27.3969Z" fill="#E01E5A"/>
                      <path d="M20.6032 16.5355C19.1145 16.5355 17.8984 15.3194 17.8984 13.8307C17.8984 12.342 19.1145 11.1259 20.6032 11.1259C22.0919 11.1259 23.3081 12.342 23.3081 13.8307V16.5355H20.6032Z" fill="#36C5F0"/>
                      <path d="M20.6032 17.8984C22.0919 17.8984 23.3081 19.1146 23.3081 20.6033C23.3081 22.092 22.0919 23.3081 20.6032 23.3081H13.8306C12.3419 23.3081 11.1258 22.092 11.1258 20.6033C11.1258 19.1146 12.3419 17.8984 13.8306 17.8984H20.6032Z" fill="#36C5F0"/>
                      <path d="M31.4645 20.6033C31.4645 19.1146 32.6806 17.8984 34.1693 17.8984C35.6581 17.8984 36.8742 19.1146 36.8742 20.6033C36.8742 22.092 35.6581 23.3081 34.1693 23.3081H31.4645V20.6033Z" fill="#2EB67D"/>
                      <path d="M30.1016 20.6033C30.1016 22.092 28.8855 23.3081 27.3968 23.3081C25.9081 23.3081 24.6919 22.092 24.6919 20.6033V13.8307C24.6919 12.342 25.9081 11.1259 27.3968 11.1259C28.8855 11.1259 30.1016 12.342 30.1016 13.8307V20.6033Z" fill="#2EB67D"/>
                      <path d="M27.3968 31.4646C28.8855 31.4646 30.1016 32.6807 30.1016 34.1694C30.1016 35.6581 28.8855 36.8743 27.3968 36.8743C25.9081 36.8743 24.6919 35.6581 24.6919 34.1694V31.4646H27.3968Z" fill="#ECB22E"/>
                      <path d="M27.3968 30.1017C25.9081 30.1017 24.6919 28.8856 24.6919 27.3969C24.6919 25.9081 25.9081 24.692 27.3968 24.692H34.1693C35.6581 24.692 36.8742 25.9081 36.8742 27.3969C36.8742 28.8856 35.6581 30.1017 34.1693 30.1017H27.3968Z" fill="#ECB22E"/>
                      </svg>
                    </div>
                    <div className='font-medium' >Add to Slack</div>
                  </div>
                  </button>
                </div>  
              </div>
              <div></div>
          </div>
          <div> 
            <div className='flex flex-col p-2 pl-0 pr-14 gap-y-2 bg-green-50 ' >
              <div className=' flex items-center  gap-2 text-[14px] ' >
                <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#006eff"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></span>
                <span>In case you get notified with "<Link className='text-[#006eff] font-medium ' >Request to Install</Link>" message during <Link className='text-[#006eff] font-medium ' >Add to Slack</Link>, then do the following: </span>
              </div>
              <ul className=' pl-8 list-disc  text-[14px] ' >
                <li>Submit the app approval request and ask your <Link className='text-[#006eff] font-medium ' >Workspace Owner</Link> to approve the app (Owner will recieve a message by SlackBot - click <Link className='text-[#006eff] font-medium ' >Approve for Workspace</Link>). Once approved, try again. </li>
                
              </ul>
            </div>
            <hr className='mt-4' />
          </div>
        </div>
        <div>  
          <div className=' mt-7 ' >
              <div className='flex justify-between gap-4 ' >
                <div className='flex  ' >
                  <div className=' flex items-start p-0' >
                  
                      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                      width="64" height="64" viewBox="0 0 562.000000 561.000000"
                      preserveAspectRatio="xMidYMid meet">

                      <g transform="translate(0.000000,561.000000) scale(0.100000,-0.100000)"
                      fill="#000000" stroke="none">
                      <path d="M3350 4941 c-52 -17 -89 -42 -128 -86 -53 -61 -69 -125 -53 -217 16
                      -94 14 -132 -10 -162 -38 -49 -50 -51 -279 -51 -198 -1 -221 -3 -285 -24 -314
                      -104 -515 -360 -532 -676 -17 -305 128 -549 434 -733 165 -99 200 -145 173
                      -227 -16 -49 -56 -76 -211 -143 -252 -109 -393 -226 -517 -433 -236 -392 -170
                      -902 157 -1230 130 -130 283 -217 466 -266 88 -23 119 -26 255 -26 135 0 168
                      3 252 26 189 50 340 137 473 271 364 366 394 935 71 1342 -69 88 -171 179
                      -261 233 -31 19 -113 59 -183 89 -70 29 -141 65 -159 78 -42 32 -60 88 -44
                      137 16 47 54 80 187 158 195 115 326 267 391 454 24 72 27 94 28 220 0 128 -2
                      148 -29 228 -17 53 -51 123 -84 175 -120 188 -122 193 -122 243 0 61 31 93
                      127 132 132 52 193 129 193 242 0 100 -50 184 -134 227 -43 22 -136 32 -176
                      19z m-397 -822 c155 -51 260 -166 302 -326 79 -305 -192 -610 -498 -562 -262
                      42 -438 308 -372 564 67 256 327 405 568 324z m5 -1745 c42 -8 113 -33 157
                      -54 142 -69 235 -164 311 -315 54 -109 74 -197 74 -331 0 -201 -68 -372 -205
                      -510 -90 -91 -169 -140 -285 -176 -61 -19 -97 -23 -195 -22 -104 0 -131 4
                      -200 28 -118 41 -181 80 -272 171 -67 68 -89 99 -126 176 -63 131 -81 221 -74
                      373 6 134 24 203 83 316 139 266 434 405 732 344z"/>
                      </g>
                      </svg>


                  </div>
                  <div className='flex flex-col p-2 pl-0 gap-y-2' >
                      <h1 className='text-[20px] text-black font-bold ' >Greenhouse</h1>
                      <ul className=' pl-6 list-disc text-gray-500 text-[14px] ' >
                        <li>The Greenhouse-BarRaiser integration allows you to seamlessly upload the candidate details to the BarRaiser system and extract/retrieve the BarRaiser  Global Scorecard (BGS) from BarRaiser to Greenhouse.</li>
                        
                      </ul>
                  </div>
                </div>
                <div className='' >
                  <button>
                  <div className=' w-[110px] h-[32px]  flex items-center justify-center bg-[#007AFF] text-white border-2  rounded-md ' >
                    <button className=' font-medium ' >Integrate</button>                    
                  </div>
                  </button>
                </div>  
              </div>
              <div></div>
          </div>
          <div> 
            <div className='flex flex-col p-2 pl-0 pr-14 gap-y-2 bg-green-50 ' >
              <div className=' flex items-center  gap-2 text-[14px] ' >
                <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#006eff"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></span>
                <span>Generate<Link className='text-[#006eff] font-medium ' > API key</Link> by clicking on the<Link className='text-[#006eff] font-medium ' > Integrate </Link> button and then submit the<Link className='text-[#006eff] font-medium ' >API key</Link> to <Link className='text-[#006eff] font-medium ' >Greenhouse.</Link>  </span>
              </div>
              <ul className=' pl-8 list-disc  text-[14px] ' >
                <li> Please refer to the detailed integration document -<Link className='text-[#006eff] font-medium ' > Integration Documentation Link. </Link>   </li>
                
              </ul>
            </div>
            <hr className='mt-4' />
          </div>
        </div>
        <div className=' mt-7 ' >
              <div className='flex justify-between gap-4 ' >
                <div className='flex gap-[14PX]  ' >
                  <div className=' flex items-start p-0' >
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="54" height="54" viewBox="0 0 500.000000 500.000000"
                    preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
                    fill="#000000" stroke="none">
                    <path d="M0 2500 l0 -2500 2500 0 2500 0 0 2500 0 2500 -2500 0 -2500 0 0
                    -2500z m3350 1295 c140 -47 270 -92 288 -101 43 -20 54 -44 156 -346 83 -245
                    86 -258 76 -300 -11 -41 -88 -121 -943 -975 -806 -806 -937 -933 -972 -942
                    -25 -7 -176 -11 -403 -11 -381 0 -410 3 -426 45 -11 31 -7 760 5 796 8 25 259
                    282 938 962 509 511 940 935 956 943 17 7 39 13 50 14 12 0 135 -38 275 -85z
                    m240 -2262 c153 -153 281 -288 285 -301 10 -32 -10 -75 -44 -95 -26 -15 -79
                    -17 -563 -17 -409 0 -539 3 -558 13 -32 16 -54 61 -45 95 4 17 107 128 284
                    305 l277 277 43 0 44 0 277 -277z"/>
                    </g>
                    </svg>

                  </div>
                  <div className='flex flex-col p-2 pl-0 gap-y-2' >
                      <h1 className='text-[20px] text-black font-bold ' >Lever</h1>
                      <ul className=' pl-6 list-disc text-gray-500 text-[14px] ' >
                        <li>The Lever-BarRaiser integration allows you to seamlessly upload the candidate to the BarRaiser system and get the BarRaiser  Global Scorecard (BGS) from BarRaiser to Lever.</li>
                      </ul>
                  </div>
                </div>    
                <div className='' >
                  <button>
                  <div className=' w-[110px] h-[32px]  flex items-center justify-center bg-[#007AFF] text-white border-2  rounded-md ' >
                    <button className=' font-medium ' >Integrate</button>                    
                  </div>
                  </button>
                </div>  
              </div>
              <div></div>
          </div>
    </div>
  )
}

export default Integration
