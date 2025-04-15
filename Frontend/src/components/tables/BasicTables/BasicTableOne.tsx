import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface EnquiryData {
  name: string;
  dob: string;
  mobile: string;
  email: string;
  education: string;
  yearOfPassout: string;
  course: string;
  placement: string;
  profession: string;
  company: string;
  designation: string;
  duration: string;
  pf: string;
  uan: string;
  form16: string;
  address: string;
  pan: string;
  referBy: string;
  refererMobile: string;
}

// Sample data for demonstration
const enquiryData: EnquiryData[] = [
  {
    name: "John Doe",
    dob: "2000-01-01",
    mobile: "9876543210",
    email: "john.doe@example.com",
    education: "B.Tech",
    yearOfPassout: "2022",
    course: "Web Development",
    placement: "Yes",
    profession: "IT",
    company: "Tech Solutions",
    designation: "Software Engineer",
    duration: "2 years",
    pf: "Yes",
    uan: "1234567890",
    form16: "Available",
    address: "123 Street, City",
    pan: "ABCDE1234F",
    referBy: "Jane Doe",
    refererMobile: "9876543211",
  },
];

export default function StudentEnquiryTable() {
  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="w-full min-w-[1200px]">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {Object.keys(enquiryData[0]).map((field) => (
                <TableCell
                  key={field}
                  isHeader
                  className="px-5 py-3 whitespace-nowrap font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {field.toUpperCase().replace(/_/g, " ")}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {enquiryData.map((data, index) => (
              <TableRow key={index}>
                {Object.values(data).map((value, idx) => (
                  <TableCell
                    key={idx}
                    className="px-4 py-3 whitespace-nowrap text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
