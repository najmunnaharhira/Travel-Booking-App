import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { deleteBooking } from "../redux/actions";
import { deleteBooking as deleteBookingApi } from "../api";

const Table = () => {
  const data = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (e) => {
    const id = e.currentTarget.dataset.id;
    setDeletingId(id);
    try {
      await deleteBookingApi(id);
      dispatch(deleteBooking(id));
    } catch (err) {
      alert(err.message || "Failed to delete booking");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {data.length > 0 && (
      <div className="max-w-6xl mx-auto mt-5 bg-white">
          <div className="overflow-x-auto ">
          <table className="table">
            {/* head */}
            <thead className="bg-slate-300 text-black rounded-sm">
              <tr>
                <th>DESTINATION FROM</th>
                <th>DESTINATION TO</th>
                <th>JOURNEY DATE</th>
                <th>GUESTS</th>
                <th>CLASS</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>
              {data.map((data, i) => (
                <tr key={i}>
                  <td>{data.from}</td>
                  <td>{data.to}</td>
                  <td>{data.date}</td>
                  <td>{data.guests}</td>
                  <td>{data.ticketclassName}</td>
                  <td><button className="btn-xs bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed" data-id={data.id} onClick={handleDelete} disabled={deletingId === String(data.id)} type="button"><MdDelete /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </>
  );
};

export default Table;
