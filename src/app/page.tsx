import Image from 'next/image'
import Hero from "@/assets/images/hero/hero.png";
import { useServerSession } from '@/hooks/useSession';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBook, faGhost } from '@fortawesome/free-solid-svg-icons';
import { sql } from '@vercel/postgres';
import { pool } from './layout';
import { pluralize } from '@/utils/strings';
import { ArrowRight, Edit, EditIcon } from 'lucide-react';
import Translatable from '@/components/Translatable';
import { redirect } from 'next/navigation';

type Donor = {
  id: number;
  username: string;
  months: number;
}

export type Beatmap = {
  id: number
  title: string
  titleUnicode: string
  artist: string
  artistUnicode: string
  creator: string
  version: string
  parentId: number
  beatmapId: number
  ar: number
  od: number
  cs: number
  hp: number
  stars: number
  gameMode: number
  bpm: number
  maxCombo: number
  hitLength: number
  totalLength: number
  status: number
  frozen: boolean
  checksum: string
  statusReason: any
  updatedStatusById: number
  creatorId: number
  lastUpdate: any
  lastStatusUpdate: string
  username: string
}

export type NewsEntry = {
  id: string
  date: string
  createdBy: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  username: string
}


export default async function Home() {

  const { data: { users, online } } = await fetch(`https://c.lisek.cc/api/v2/bancho/stats`, { cache: "no-cache" }).then(res => res.json());

  const { user, headers } = await useServerSession();

  if (user && user.flags & 32) {
    return redirect("/verify");
  }
  const topDonors: Array<Donor> = user ? await pool.query(`SELECT u.id, u.username, CEIL(SUM(p.sum) / 148.5) AS months
  FROM "public"."PaymentEntry" p
  INNER JOIN "User" u ON p."userId" = u.id 
  GROUP BY u.id, u.username
  ORDER BY "months" DESC
  LIMIT 5`).then(c => c.rows) : [];

  const recentRanked: Array<Beatmap> = user ? await pool.query(`SELECT b1.*, u."username"
  FROM public."Beatmap" b1
  LEFT JOIN  public."Beatmap" b2 
         ON b1."parentId" = b2."parentId" AND b1.id < b2.id -- Check for duplicates
  INNER JOIN "User" u
      ON u.id = b1."updatedStatusById"
  WHERE b2.id IS NULL -- Keep only rows where no duplicate was found 
  AND b1."lastStatusUpdate" IS NOT NULL -- Add your original condition
  ORDER BY b1."lastStatusUpdate" DESC 
  LIMIT 5;`).then(c => c.rows) : [];

  const news: Array<NewsEntry> = user ? await pool.query(`SELECT p.*, "user"."username" FROM public."Post" p
  INNER JOIN "User" "user" ON "user"."id" = p."createdBy"
  ORDER BY p."date" DESC
  LIMIT 3
  `).then(c => c.rows) : [];

  return (
    <main className="flex items-center justify-center py-8 sm:py-1 flex-col w-[90%] sm:w-[80%] select-none">
      {!user && <div className='flex flex-col sm:flex-row justify-center sm:justify-between bg-background-800/10 w-full h-auto sm:max-h-[350px] my-0 mx-auto rounded-md'>
        <div className='p-8 flex flex-col gap-8'>
          <div className='text-8xl sm:text-8xl leading-[100px] flex flex-col'>
            OSU!
            <div className='text-primary-700'>LISEK</div>
          </div>
          <div className='flex flex-row items-center gap-4'>
            <div className='bg-background-950/80 py-2 px-6 text-2xl flex flex-row gap-2 rounded-xl'>
              <span className='text-primary-600'>
                {users}
              </span>
              Users
            </div>
            <div className='bg-background-950/80 py-2 px-6 text-2xl flex flex-row gap-2 rounded-xl'>
              <span className='text-primary-600'>
                {online}
              </span>
              Online
            </div>
            <div>
            </div>
          </div>
        </div>
        <div>
          <Image src={Hero} placeholder='blur' blurDataURL={Hero.blurDataURL} alt='Hero image' width={400} height={600} className='duration-200 h-full object-cover sm:object-almost-top -scale-x-100' />
        </div>
      </div>}

      {user && <div className='w-full'>
        <div className='flex flex-col-reverse sm:flex-row sm:justify-between w-full h-auto my-0 p-4 mx-auto rounded-md gap-2'>
          <div className='text-3xl bg-background-800/20 flex-1 rounded-md overflow-hidden p-4'>

            <div className='w-full flex flex-col gap-2'>
              {news.map((c, i) => <div key={i} className='flex flex-row gap-4 p-4 bg-background-950 w-full rounded-xl group'>
                <Image src={c.imageUrl} alt='Hero image' width={256} height={128} className='duration-200 object-cover object-almost-top -scale-x-100 w-[256px] h-[150px] group-hover:object-center rounded-xl brightness-75 group-hover:brightness-100' />
                <div className='flex flex-col justify-between flex-1'>
                  <Link className='flex flex-col gap-1' href={`/posts/${c.id}`}>
                    <span>{c.title}</span>
                    <span className='text-lg'>{c.subtitle}</span>
                    <p className="text-sm text-background-400">
                        {/** @ts-ignore */}
                        {new Date(c.date).toLocaleDateString({ locale: 'en-US' }, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </Link>
                  <div className='flex flex-row justify-between'>
                    <Link href={`/users/${c.createdBy}`} className='text-lg flex flex-row gap-1 mt-2'><Image src={`https://a.lisek.cc/${c.createdBy}`} width={32} height={32} alt='hero' className='rounded-full' /> {c.username}</Link>
                    <div className='flex flex-row gap-1 text-xs'>
                      {user.permissions & 16 ? <Link href={`/posts/${c.id}/edit`} className='text-lg flex flex-row gap-1 mt-2 items-center px-2 py-0.5border-[1px] rounded-xl'>Edit da post <EditIcon /></Link> : <></>}
                      <Link href={`/posts/${c.id}`} className='text-lg flex flex-row gap-1 mt-2 items-center px-2 py-0.5border-[1px] rounded-xl'>Read more <ArrowRight /></Link>
                    </div>
                  </div>
                </div>
              </div>)}

              {user.permissions & 16 ? <Link href={"/news/create"} className='flex flex-row gap-4 p-3 bg-background-950 w-full rounded-xl text-base justify-center hover:border-primary-500 duration-200 border-[2px] border-transparent'>
                  Add post
                </Link> : <></>}
            </div>
          </div>
          <div className='p-2 flex flex-col justify-start bg-background-800/20 flex-nowrap gap-3 rounded-md w-full sm:w-auto'>
            <div className='flex flex-row gap-2 text-sm px-6'>
              <div>
                <span className='text-primary-500'>{users}</span> Online
              </div>
              <div>
                <span className='text-primary-500'>{online}</span> Online
              </div>
              <div>
                <span className='text-primary-500'>0</span> Multi rooms
              </div>
            </div>
            <div className='flex flex-col gap-2 w-full *:w-full *:flex *:flex-row *:gap-2 *:justify-start *:rounded-md *:py-2 *:px-4 *:duration-200 *:ease-in-out'>
              <Link href={"/socials/discord"} className='gap-1 bg-royal-blue-600 hover:bg-royal-blue-500 hover:px-6'>
                <FontAwesomeIcon icon={faDiscord} width={24} height={24} /> Join Discord
              </Link>
              <Link href={"/docs/how-to-connect"} className='bg-green-700 hover:bg-green-600 hover:px-6'>
                <FontAwesomeIcon icon={faBook} width={24} height={24} /> How to connect?
              </Link>
              <Link href={"https://twitter.com/lisek_osu"} className='bg-purple-700 hover:bg-purple-600 hover:px-6'>
                <FontAwesomeIcon icon={faTwitter} width={24} height={24} /> Twitter
              </Link>
            </div>
            <div className='flex flex-col justify-start gap-2 h-auto'>
              <span className='text-lg'>
                Top supporters
              </span>
              <div className='flex flex-col gap-2'>
                {topDonors.filter(c => c.months).map((c, i) => <div key={i} className='flex flex-row gap-2'>
                  <div>
                    <Image src={`https://a.lisek.cc/${c.id}`} width={48} height={48} alt='User avatar' className='rounded-md' />
                  </div>
                  <div className='flex flex-col'>
                    <Link href={`/users/${c.id}`} className='text-base'>
                      {c.username}
                    </Link>
                    <div className='text-sm text-background-100'>
                      Supporting us for <span className='text-primary-500'>{c.months}</span> {pluralize(c.months, "month")}
                    </div>
                  </div>
                </div>)}

              </div>
            </div>
            <div className='flex flex-col justify-start gap-2 h-auto'>
              <span className='text-lg'>
                Recently ranked beatmaps
              </span>
              <div className='flex flex-col gap-2'>
                {recentRanked.map((c, i) => <div key={i} className='flex flex-row gap-2'>
                  <div>
                    <Image src={`https://assets.ppy.sh/beatmaps/${c.parentId}/covers/list@2x.jpg`} width={64} height={64} alt='User avatar' className='rounded-md object-cover w-[64px] h-[64px]' />
                  </div>
                  <div className='flex flex-col'>
                    <Link href={`https://osu.lisek.cc/beatmapsets/${c.parentId}/${c.beatmapId}`} className='text-sm'>
                      {c.title}
                    </Link>
                    <div className='text-sm text-background-100 flex flex-col'>
                      <span>by <span className='text-primary-600'>{c.artist}</span></span>
                      <span>Ranked by <Link href={`/users/${c.updatedStatusById}`}><span className='text-primary-400'>{c.username}</span></Link></span>
                    </div>
                  </div>
                </div>)}

              </div>
            </div>
          </div>

        </div>
      </div>}
    </main>
  )
}
