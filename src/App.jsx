// // import react from 'react'
// // import './App.css'
// // import Hr from './component/Hr'

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import PlanTrip from './component/PlanTrip'
// import Itinerary from './component/Itinerary'


// function App() {
  

//   return (
   

// <Router>
//       <Routes>
//         <Route path="/" element={<PlanTrip />} />
//         <Route path="/itinerary" element={<Itinerary />} />
//       </Routes>
//     </Router>
      
    
   
  
 
//   )
// }

// export default App




import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlanTrip from "./component/PlanTrip";
import Itinerary from "./component/Itinerary";
// import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlanTrip />} />
        <Route path="/itinerary" element={<Itinerary />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}
