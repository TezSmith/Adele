/** Types generated for queries found in "repositories/sql/messages.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

/** 'InsertMessage' parameters type */
export interface IInsertMessageParams {
  content: string;
  senderId: string;
}

/** 'InsertMessage' return type */
export interface IInsertMessageResult {
  content: string;
  created_at: Date;
  id: number;
  sender_id: string;
}

/** 'InsertMessage' query type */
export interface IInsertMessageQuery {
  params: IInsertMessageParams;
  result: IInsertMessageResult;
}

const insertMessageIR: any = {"usedParamSet":{"content":true,"senderId":true},"params":[{"name":"content","required":true,"transform":{"type":"scalar"},"locs":[{"a":109,"b":117}]},{"name":"senderId","required":true,"transform":{"type":"scalar"},"locs":[{"a":120,"b":129}]}],"statement":"                            \n                             \nINSERT INTO messages (content, sender_id)\nVALUES (:content!, :senderId!)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 *                             
 *                              
 * INSERT INTO messages (content, sender_id)
 * VALUES (:content!, :senderId!)
 * RETURNING *
 * ```
 */
export const insertMessage = new PreparedQuery<IInsertMessageParams,IInsertMessageResult>(insertMessageIR);


/** 'GetRecentMessages' parameters type */
export interface IGetRecentMessagesParams {
  limit: NumberOrString;
}

/** 'GetRecentMessages' return type */
export interface IGetRecentMessagesResult {
  content: string;
  created_at: Date;
  id: number;
  sender_id: string;
}

/** 'GetRecentMessages' query type */
export interface IGetRecentMessagesQuery {
  params: IGetRecentMessagesParams;
  result: IGetRecentMessagesResult;
}

const getRecentMessagesIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":81,"b":87}]}],"statement":"                          \nSELECT * FROM messages\nORDER BY created_at DESC\nLIMIT :limit!"};

/**
 * Query generated from SQL:
 * ```
 *                           
 * SELECT * FROM messages
 * ORDER BY created_at DESC
 * LIMIT :limit!
 * ```
 */
export const getRecentMessages = new PreparedQuery<IGetRecentMessagesParams,IGetRecentMessagesResult>(getRecentMessagesIR);


/** 'GetMessagesBySender' parameters type */
export interface IGetMessagesBySenderParams {
  senderId: string;
}

/** 'GetMessagesBySender' return type */
export interface IGetMessagesBySenderResult {
  content: string;
  created_at: Date;
  id: number;
  sender_id: string;
}

/** 'GetMessagesBySender' query type */
export interface IGetMessagesBySenderQuery {
  params: IGetMessagesBySenderParams;
  result: IGetMessagesBySenderResult;
}

const getMessagesBySenderIR: any = {"usedParamSet":{"senderId":true},"params":[{"name":"senderId","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":80}]}],"statement":"                             \nSELECT * FROM messages\nWHERE sender_id = :senderId!\nORDER BY created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 *                              
 * SELECT * FROM messages
 * WHERE sender_id = :senderId!
 * ORDER BY created_at DESC
 * ```
 */
export const getMessagesBySender = new PreparedQuery<IGetMessagesBySenderParams,IGetMessagesBySenderResult>(getMessagesBySenderIR);


