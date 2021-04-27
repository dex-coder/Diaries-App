import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer/rootReducer";
import http from "../services/api";
import { Diary } from "../interfaces/diary.interface";
import { addDiary } from "../features/diary/diariesSlice";
import Swal from "sweetalert2";
import { setUser } from "../features/auth/userSlice";
import DiaryTile from "./DiaryTile";
// import { User } from "../../interface/user.interface";
// import { Route, Routes } from "react-router-dom";
// import DiaryEntriesList from "./DiaryEntryList";
import { useAppDispatch } from "../store/store";
import dayjs from "dayjs";

const Diaries: FC = () => {
  const dispatch = useAppDispatch();
  const diaries = useSelector((state: RootState) => state.diaries);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        http.get<Diary[]>(`diaries/${user.id}`).then((data: any) => {
          if (data && data.length > 0) {
            const sortedByUpdatedAt = data.sort((a: any, b: any) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(addDiary(sortedByUpdatedAt));
          }
        });
      }
    };
    fetchDiaries();
  }, [dispatch, user]);

  const createDiary = async () => {
    const result: any = await Swal.mixin({
      input: "text",
      confirmButtonText: "Next →",
      showCancelButton: true,
      progressSteps: ["1", "2"],
    }).queue([
      {
        titleText: "Diary title",
        input: "text",
      },
      {
        titleText: "Private or public diary?",
        input: "radio",
        inputOptions: {
          private: "Private",
          public: "Public",
        },
        inputValue: "private",
      },
    ]);
    if (result.value) {
      const { value } = result;
      const { diary, user: _user }: any = await http.post<Partial<Diary>>(
        "/diaries/",
        {
          title: value[0],
          type: value[1],
          userId: user?.id,
        }
      );
      if (diary && user) {
        dispatch(addDiary([diary] as Diary[]));
        dispatch(addDiary([diary] as Diary[]));
        dispatch(setUser(_user));
        diaries.map((dia, idx) => {
          return <h1>Gekk</h1>;
        });
        return Swal.fire({
          titleText: "All done!",
          confirmButtonText: "OK!",
        });
      }
    }
    Swal.fire({
      titleText: "Cancelled",
    });
  };
  console.log(diaries);

  return (
    <div style={{ padding: "1em 0.4em" }}>
      <button onClick={createDiary}>Create New</button>
      {diaries.map((diary, idx) => {
        return <DiaryTile key={idx} diary={diary} />;
      })}
    </div>
  );
};

export default Diaries;
