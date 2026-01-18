import PageMeta from "../components/common/PageMeta";
import { useNavigate } from "react-router-dom";

export default function HomeRedirectPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4" style={{ marginTop: '30px' }}>
      <PageMeta
        title="Skill Fort | Portal Selection"
        description="Choose Admin or Student portal"
      />

      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-lg text-center">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
          Select Portal
        </h2>

        <div className="flex flex-col gap-4">
          {/* Admin Button */}
          <button
            onClick={() => navigate("/admin")}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium
                       hover:bg-blue-700 transition
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Admin Page
          </button>

          {/* Student Button */}
          <button
            onClick={() => navigate("/student")}
            className="w-full rounded-lg bg-green-600 px-6 py-3 text-white font-medium
                       hover:bg-green-700 transition
                       focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Student Page
          </button>
        </div>
      </div>
    </div>
  );
}
