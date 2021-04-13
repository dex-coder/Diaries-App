import { Diary } from "../../../interfaces/diary";
import { User } from "../../../interfaces/user";
import { handleErrors } from "../server";

export const create = (
    schema: any,
    req: Request
):{ user: User; diary: Diary } | Response => {
    try {
        const { title, type, userId } = JSON.parse(req.requestBody) as Partial<Diary>;

        const exUser = schema.users.findBy({id: userId})
        if(!exUser){
            return handleErrors(null, 'No such user exists.')
        }

        const now = dayjs().format();
        const diary = exUser.createDiary({
            title,
            type,
            createdAt: now,
            updatedAt: now,
        });

        return{
            user:{
                ...exUser.attrs,
            },
            diary: diary.attrs,
        };

    }catch(error){
        return handleErrors(null, 'Failed to create Diary.')
    }
};

export const updateDiary = (schema: any, req: Request): Diary | Response => {
    try{
        const diary = schema.diaries.find(req.params.id);
        const data = JSON.parse(req.requestBody) as Partial<Diary>;
        const now  = dayjs().format();
        diary.update({
            ...data,
            updatedAt:now,
        });
        return diary.attrs as Diary;
    } catch(error){
        return handleErrors(null, 'Failed to update Diary.')
    }
};


export const getDiaries = (schema: any, req: Request): Diary[] | Response => {
    try{
        const user = schema.users.find(req.params.id);
        return user.diary as Diary[];
    } catch(error){
        return handleErrors(null, 'Could not get user diaries.')
    }
};