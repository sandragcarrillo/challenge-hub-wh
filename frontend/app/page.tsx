"use client"; 

import Link from "next/link"
import Image from 'next/image';

export default function Home() {

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#3b38f4] to-[#8988f8]">
          <div className="px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                  Embark on Decentralized Challenges
                </h1>
                <p className="max-w-[600px] text-white md:text-xl">
                  Explore a world of community-driven challenges, earn rewards while having fun and engaging with your community.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/challenges"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-[#6c5ce7] shadow transition-colors hover:bg-[#a29bfe] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Join a live Challenge
                </Link>
                <Link
                  href="/CreateQuest"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-[#6c5ce7] shadow transition-colors hover:bg-[#a29bfe] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Launch your Challenge
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image src="/ChallengeHub.png" alt="description" width={500} height={300} 
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter py-4 sm:text-5xl">
                  Discover the Power of Curiosi3 Quests
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  This is a community led platform with learn and earn model for decentralized education on web3, allowing any community to engage with their members.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <div className="inline-block rounded-lg  bg-C3 text-white  px-3 py-1 text-sm">Decentralized Rewards</div>
                <h3 className="text-xl font-bold">Earn Rewards</h3>
                <p className="text-muted-foreground">
                  Participate in quests and earn rewards in the form of cryptocurrency, NFTs, or other digital assets.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="inline-block rounded-lg  bg-C3 text-white  px-3 py-1 text-sm">Account Abstraction</div>
                <h3 className="text-xl font-bold">No gas fee for your community</h3>
                <p className="text-muted-foreground">
                  Your members can participate in challenges without paying gas fees until they need to claim a prize.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="inline-block rounded-lg bg-C3 text-white px-3 py-1 text-sm">Community Incentives</div>
                <h3 className="text-xl font-bold">Invite your Community</h3>
                <p className="text-muted-foreground">
                  Create challenges for your community and motivate them to participate in your activities.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Explore Active Challenges</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out some of the amazing challenges that communities have created and join the adventure!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

