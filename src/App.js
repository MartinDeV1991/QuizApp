import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import {
	HomePage,
	QuizPage,
} from "./pages";
import TopNav from "partials/TopNav";
import Footer from "partials/Footer";

function App() {
	return (
		<>
			<TopNav />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/quiz" element={<QuizPage />} />
			</Routes>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover={false}
				theme="light"
			/>
			<Footer />
		</>
	);
}

export default App;
