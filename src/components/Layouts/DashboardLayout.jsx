import Sidebar from "../Components/Sidebar";

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar />
            <div className="flex-1 md:ml-20 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;