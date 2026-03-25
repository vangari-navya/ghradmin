import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ChevronLeft, ChevronRight, FileText, Database } from 'lucide-react';

interface FormData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

export function FormSection() {
  const [data, setData] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch('https://ghrbackenddata.onrender.com/api/contact', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ if protected API
        },
      });

      const jsonData = await response.json();

      // ✅ Map API response to your UI format
      const formattedData: FormData[] = jsonData.map((item: any) => ({
        id: item._id, // MongoDB id
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        message: item.message,
      }));

      setData(formattedData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#1E5F85]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Form Data</h2>
          </div>
          <p className="text-gray-600">View and manage submitted form entries</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
          <Database className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Total Entries</p>
            <p className="text-xl font-bold text-gray-900">{data.length}</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Full Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Email</TableHead>
                    <TableHead className="font-semibold text-gray-900">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-900">Message</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">
                          {item.fullName}
                        </TableCell>

                        <TableCell className="text-gray-600">
                          {item.email}
                        </TableCell>

                        <TableCell className="text-gray-600">
                          {item.phone}
                        </TableCell>

                        <TableCell className="text-gray-600 max-w-lg">
                          <p className="truncate">{item.message}</p>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-12">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50">
                    <h3 className="font-semibold text-gray-900">{item.fullName}</h3>
                    <p className="text-sm text-gray-600">{item.email}</p>
                    <p className="text-sm text-gray-600">{item.phone}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, data.length)}
                    </span>{' '}
                    of <span className="font-medium">{data.length}</span> results
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm font-medium">
                      {currentPage} / {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}