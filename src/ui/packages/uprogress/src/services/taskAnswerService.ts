import {
  GetTaskAnswer,
  GetTaskAnswerResult,
} from './../models/messages/GetTaskAnswer';
import { API_URLS } from '../constants';
import { getHttpClient } from '../utils/httpUtils';
import {
  CreateTaskAnswer,
  CreateTaskAnswerResult,
} from './../models/messages/CreateTaskAnswer';
import {
  RequestApprove,
  RequestApproveResult,
} from '../models/messages/RequestApprove';
import { Approve, ApproveResult } from '../models/messages/Approve';
import { Reject, RejectResult } from '../models/messages/Reject';

const createTaskAnswer = async (
  message: CreateTaskAnswer
): Promise<CreateTaskAnswerResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.taskAnswer.createTaskAnswer, message)
    ).data;

    return {
      isSuccessful: true,
      taskAnswerId: result.taskAnswerId,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as CreateTaskAnswerResult;
  }
};

const getTaskAnswer = async (
  message: GetTaskAnswer
): Promise<GetTaskAnswerResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.taskAnswer.getTaskAnswer, message)
    ).data;

    return {
      isSuccessful: true,
      id: result.id,
      mark: result.mark,
      answer: result.answer,
      status: result.status,
      taskId: result.taskId,
      taskName: result.taskName,
      studentId: result.studentId,
      approvedById: result.approvedById,
      disciplineId: result.disciplineId,
      disciplineName: result.disciplineName,
      history: result.history,
      attachments: result.attachments,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetTaskAnswerResult;
  }
};

const requestApprove = async (
  message: RequestApprove
): Promise<RequestApproveResult> => {
  try {
    await getHttpClient().post(API_URLS.taskAnswer.requestApprove, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as RequestApproveResult;
  }
};

const approve = async (message: Approve): Promise<ApproveResult> => {
  try {
    await getHttpClient().post(API_URLS.taskAnswer.approve, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as ApproveResult;
  }
};

const reject = async (message: Reject): Promise<RejectResult> => {
  try {
    await getHttpClient().post(API_URLS.taskAnswer.reject, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as RejectResult;
  }
};

export const taskAnswerService = {
  createTaskAnswer,
  getTaskAnswer,
  requestApprove,
  approve,
  reject,
};
