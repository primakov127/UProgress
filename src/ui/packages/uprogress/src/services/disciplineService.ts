import { GetTask, GetTaskResult } from './../models/messages/GetTask';
import {
  GetDiscipline,
  GetDisciplineResult,
} from './../models/messages/GetDiscipline';
import { CreateTask, CreateTaskResult } from './../models/messages/CreateTask';
import { API_URLS } from '../constants';
import {
  DeleteDiscipline,
  DeleteDisciplineResult,
} from '../models/messages/DeleteDiscipline';
import { GetDisciplineListResult } from '../models/messages/GetDisciplineList';
import { getHttpClient } from '../utils/httpUtils';
import {
  CreateDiscipline,
  CreateDisciplineResult,
} from './../models/messages/CreateDiscipline';
import { Discipline, Speciality, Task } from '@ui/app-shell';
import { DeleteTask, DeleteTaskResult } from '../models/messages/DeleteTask';
import { GetMyDisciplinesResult } from '../models/messages/GetMyDisciplines';

const createDiscipline = async (
  message: CreateDiscipline
): Promise<CreateDisciplineResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.discipline.createDiscipline, message)
    ).data;

    return {
      isSuccessful: true,
      id: result.disciplineId,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as CreateDisciplineResult;
  }
};

const getDisciplineList = async (): Promise<GetDisciplineListResult> => {
  try {
    const result = (
      await getHttpClient().get(API_URLS.discipline.getDisciplineList)
    ).data;

    return {
      isSuccessful: true,
      list: result,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetDisciplineListResult;
  }
};

const getDiscipline = async (
  message: GetDiscipline
): Promise<GetDisciplineResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.discipline.getDiscipline, message)
    ).data;

    return {
      isSuccessful: true,
      id: result.id,
      name: result.name,
      description: result.description,
      semester: result.semester,
      type: result.type,
      specialityId: result.specialityId,
      tasks: result.tasks,
      speciality: { shortName: result.specialityShortName } as Speciality,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetDisciplineResult;
  }
};

const deleteDiscipline = async (
  message: DeleteDiscipline
): Promise<DeleteDisciplineResult> => {
  try {
    await getHttpClient().post(API_URLS.discipline.deleteDiscipline, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as DeleteDisciplineResult;
  }
};

const createTask = async (message: CreateTask): Promise<CreateTaskResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.discipline.createTask, message)
    ).data;

    return {
      isSuccessful: true,
      id: result.taskId,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as CreateDisciplineResult;
  }
};

const deleteTask = async (message: DeleteTask): Promise<DeleteTaskResult> => {
  try {
    await getHttpClient().post(API_URLS.discipline.deleteTask, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as DeleteTaskResult;
  }
};

const getTask = async (message: GetTask): Promise<GetTaskResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.discipline.getTask, message)
    ).data;

    return {
      isSuccessful: true,
      id: result.id,
      name: result.name,
      description: result.description,
      isRequired: result.isRequired,
      disciplineId: result.disciplineId,
      disciplineName: result.disciplineName,
      taskAnswerId: result.taskAnswerId,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetTaskResult;
  }
};

const getMyDisciplines = async (): Promise<GetMyDisciplinesResult> => {
  try {
    const result = (
      await getHttpClient().get(API_URLS.discipline.myDisciplines)
    ).data;

    return {
      isSuccessful: true,
      list: result,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetMyDisciplinesResult;
  }
};

export const disciplineService = {
  createDiscipline,
  getDisciplineList,
  deleteDiscipline,
  createTask,
  getDiscipline,
  deleteTask,
  getTask,
  getMyDisciplines,
};
