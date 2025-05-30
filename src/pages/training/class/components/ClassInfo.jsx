import ClassDetail from "./ClassDetail";
import useClassData from "../hooks/useClassData";
import StudentList from "./StudentList";
import { Loader } from "@/components/common";
import { useParams } from "react-router";

const ClassInfo = () => {
  const { id } = useParams();
  const { loading, data, shiftObj, ready } = useClassData();

  return (
    <div id="info" className="flex gap-4 w-full justify-center flex-wrap">
      <Loader isLoading={loading} />
      {ready && (
        <>
          <div className="shadow-small p-2 pb-4 sm:p-4 sm:pb-8 rounded-large flex-1">
            <p className="text-lg font-bold">Thông tin lớp học</p>
            <div className="rounded-lg mt-4">
              <ClassDetail
                data={data.item}
                refs={{
                  ...data?.refs,
                  shift: shiftObj[data.item?.shiftId],
                  studentCount: Number(data.refs?.studentCount?.total || 0),
                }}
              />
            </div>
          </div>
          <div className="shadow-small p-2 pb-4 sm:p-4 sm:pb-8 rounded-large ">
            <p className="text-lg font-bold">Danh sách học viên</p>
            <div className="rounded-lg mt-4">
              <StudentList classId={id} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassInfo;
