/** Types generated for queries found in "repositories/sql/conversation-starters.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetConversationStarters' parameters type */
export type IGetConversationStartersParams = void;

/** 'GetConversationStarters' return type */
export interface IGetConversationStartersResult {
  content: string;
  id: number;
}

/** 'GetConversationStarters' query type */
export interface IGetConversationStartersQuery {
  params: IGetConversationStartersParams;
  result: IGetConversationStartersResult;
}

const getConversationStartersIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM conversation_starters"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM conversation_starters
 * ```
 */
export const getConversationStarters = new PreparedQuery<IGetConversationStartersParams,IGetConversationStartersResult>(getConversationStartersIR);


