import { neon } from '@neondatabase/serverless';

export interface Message {
  id: string;
  recipientName: string;
  message: string;
  contactMethod: 'email' | 'phone';
  contactValue: string;
  timestamp: number;
  fulfilled: boolean;
}

export type NewMessage = Omit<Message, 'id' | 'timestamp' | 'fulfilled'>;

type DbMessageRow = {
  id: string;
  recipient_name: string;
  message: string;
  contact_method: 'email' | 'phone';
  contact_value: string;
  created_at: string;
  fulfilled: boolean;
};

const DATABASE_URL =
  import.meta.env.VITE_DATABASE_URL ??
  'postgresql://neondb_owner:npg_ksobdA9xH4Tg@ep-autumn-morning-ai09bu3t-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);
let isInitialized = false;

const ensureInitialized = async () => {
  if (isInitialized) return;
  await sql`
    create table if not exists messages (
      id text primary key,
      recipient_name text not null,
      message text not null,
      contact_method text not null,
      contact_value text not null,
      created_at timestamptz not null default now(),
      fulfilled boolean not null default false
    )
  `;
  isInitialized = true;
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const mapRow = (row: DbMessageRow): Message => ({
  id: row.id,
  recipientName: row.recipient_name,
  message: row.message,
  contactMethod: row.contact_method,
  contactValue: row.contact_value,
  timestamp: new Date(row.created_at).getTime(),
  fulfilled: row.fulfilled,
});

export const fetchMessages = async (): Promise<Message[]> => {
  await ensureInitialized();
  const rows = await sql<DbMessageRow[]>`
    select id, recipient_name, message, contact_method, contact_value, created_at, fulfilled
    from messages
    order by created_at desc
  `;
  return rows.map(mapRow);
};

export const createMessage = async (message: NewMessage): Promise<Message> => {
  await ensureInitialized();
  const id = generateId();
  const rows = await sql<DbMessageRow[]>`
    insert into messages (id, recipient_name, message, contact_method, contact_value)
    values (${id}, ${message.recipientName}, ${message.message}, ${message.contactMethod}, ${message.contactValue})
    returning id, recipient_name, message, contact_method, contact_value, created_at, fulfilled
  `;
  return mapRow(rows[0]);
};

export const updateMessageFulfilled = async (
  id: string,
  fulfilled: boolean
): Promise<Message | null> => {
  await ensureInitialized();
  const rows = await sql<DbMessageRow[]>`
    update messages
    set fulfilled = ${fulfilled}
    where id = ${id}
    returning id, recipient_name, message, contact_method, contact_value, created_at, fulfilled
  `;
  if (!rows.length) return null;
  return mapRow(rows[0]);
};
