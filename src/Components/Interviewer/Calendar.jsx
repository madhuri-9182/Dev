import React from 'react'
import { useState, useEffect } from 'react'

function Calendar() {
  return (
    <div className="w-full min-h-screen p-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Calendar</h1>
        <div className="w-full h-[600px] rounded-lg shadow-lg overflow-hidden">
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKolkata"
            style={{
              border: 0,
              width: "800px",
              height: "600px"
            }}
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>
    </div>
  )
}

export default Calendar




