import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Enquiry {
    name: string;
    enquiryId: string;
    requiredCourse: string;
}

export default function UserProfiles() {
    const [data, setData] = useState<Enquiry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/enquiry/${id}`);
                setData(res.data.enquiry);
            } catch (err) {
                setError("Failed to fetch enquiry data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!data) return null;


    return (
        <>
            <PageMeta
                title="Skill Fort | Enquiry Details"
                description="Enquiry Details"
            />
            <PageBreadcrumb pageTitle="Enquiry Details" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Enquiry Details
                </h3>
                <div className="space-y-6">
                    <UserMetaCard
                        name={data.name}
                        enquiryId={data.enquiryId}
                        requiredCourse={data.requiredCourse}
                    />
                    <UserInfoCard />
                </div>
            </div>
        </>
    );
}
