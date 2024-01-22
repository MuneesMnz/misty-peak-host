import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Purchace from "./pages/Purchace";
import Report from "./pages/Report";
import AddUser from "./pages/AddUser";
import PurchacePage from "./components/PurchacePage/PurchacePage";
import AddPurchace from "./components/PurchacePage/AddPurchace";
import CheckinForm from "./components/checkinForm/CheckinForm";
import CheckinConformForm from "./components/checkinForm/CheckinConformForm";
import AgentPage from "./components/agent/AgentPage";
import AddAgentForm from "./components/agent/AddAgentForm";
import Bookings from "./components/BookingPageHeadings/Booking";
import Waitlist from "./components/BookingPageHeadings/Waitlist";
import CheckInOut from "./components/BookingPageHeadings/CheckInOut";
import History from "./components/BookingPageHeadings/History";
import SalesHistory from "./components/reportpage/SalesHistory";
import B2bBussiness from "./components/reportpage/B2bBussiness";
import B2bBussinessHome from "./pages/B2bBussinessHome";
import User from "./components/user/User";
import AddUserForm from "./components/user/AddUserForm";
import { useAuthContext } from "./hooks/useAuthContext";
import Error404Page from "./pages/Error404Page";
import HistorySingleDetailes from "./components/BookingPageHeadings/HistorySingleDetailes";
import Reservation from "./pages/Reservation";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="font-poppins">
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/booking" element={<Booking />}>
            <Route path="booking" element={<Bookings />} />
            <Route path="waitlist" element={<Waitlist />} />
            <Route path="checkout" element={<CheckInOut />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="/purchase" element={<Purchace />}>
            <Route index element={<PurchacePage />} />
            <Route path="addpurchace" element={<AddPurchace />} />
          </Route>
          <Route path="/report" element={<Report />}>
            <Route path="sales" element={<SalesHistory />} />
            <Route path="b2b" element={<B2bBussiness />} />
          </Route>
          <Route path="/b2b" element={<B2bBussinessHome />}>
            <Route index element={<AgentPage />} />
            <Route path="addagent" element={<AddAgentForm />} />
          </Route>
          <Route path="/user" element={<AddUser />}>
            <Route index element={<User />} />
            <Route path="adduser" element={<AddUserForm />} />
          </Route>
          <Route path="/checkin/:id" element={<CheckinForm />} />
          <Route path="/checkinConform/:id" element={<CheckinForm conform />} />
          <Route path="/checkoutconfirm/:id" element={<CheckinConformForm />} />
          <Route path="/history/:id" element={<HistorySingleDetailes />} />
        </Route>
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </div>
  );
}

export default App;

{
  /* <div className="font-poppins">
<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/"
    element={
      <RequreAuth>
        <Home />
      </RequreAuth>
    }
  >
    <Route
      index
      element={
        <RequreAuth>
          <Dashboard />
        </RequreAuth>
      }
    />
    <Route
      path="/booking"
      element={
        <RequreAuth>
          <Booking />
        </RequreAuth>
      }
    >
      <Route
        path="booking"
        element={
          <RequreAuth>
            <Bookings />
          </RequreAuth>
        }
      />
      <Route
        path="waitlist"
        element={
          <RequreAuth>
            <Waitlist />
          </RequreAuth>
        }
      />
      <Route
        path="checkout"
        element={
          <RequreAuth>
            <CheckInOut />
          </RequreAuth>
        }
      />
      <Route
        path="history"
        element={
          <RequreAuth>
            <History />
          </RequreAuth>
        }
      />
    </Route>
    <Route
      path="/purchase"
      element={
        <RequreAuth>
          <Purchace />
        </RequreAuth>
      }
    >
      <Route
        index
        element={
          <RequreAuth>
            <PurchacePage />
          </RequreAuth>
        }
      />
      <Route
        path="addpurchace"
        element={
          <RequreAuth>
            <AddPurchace />
          </RequreAuth>
        }
      />
    </Route>
    <Route
      path="/report"
      element={
        <RequreAuth>
          <Report />
        </RequreAuth>
      }
    >
      <Route
        path="sales"
        element={
          <RequreAuth>
            <SalesHistory />
          </RequreAuth>
        }
      />
      <Route
        path="b2b"
        element={
          <RequreAuth>
            <B2bBussiness />
          </RequreAuth>
        }
      />
    </Route>
    <Route
      path="/b2b"
      element={
        <RequreAuth>
          <B2bBussinessHome />
        </RequreAuth>
      }
    >
      <Route
        index
        element={
          <RequreAuth>
            <AgentPage />
          </RequreAuth>
        }
      />
      <Route
        path="addagent"
        element={
          <RequreAuth>
            <AddAgentForm />
          </RequreAuth>
        }
      />
    </Route>
    <Route
      path="/user"
      element={
        <RequreAuth>
          <AddUser />
        </RequreAuth>
      }
    >
      <Route
        index
        element={
          <RequreAuth>
            <User />
          </RequreAuth>
        }
      />
      <Route
        path="adduser"
        element={
          <RequreAuth>
            <AddUserForm />
          </RequreAuth>
        }
      />
    </Route>
    <Route
      path="/checkin/:id"
      element={
        <RequreAuth>
          <CheckinForm />
        </RequreAuth>
      }
    />
    <Route
      path="/checkoutconfirm/:id"
      element={
        <RequreAuth>
          <CheckinConformForm />
        </RequreAuth>
      }
    />
  </Route>
  <Route
    path="*"
    element={
      <RequreAuth>
        <Error404Page />
      </RequreAuth>
    }
  />
</Routes>
</div> */
}
