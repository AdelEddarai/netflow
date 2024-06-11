import React from 'react';
import CardMarket from './_component/CardMarket';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { AddTaskShortcut } from '@/components/addTaskShortcut/AddTaskShortcut';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';


const MarketPage = async () => { // Add async here
  const session = await checkIfUserCompletedOnboarding();

  return (
    <>
      <DashboardHeader>
        <AddTaskShortcut userId={session.user.id} />
      </DashboardHeader>

        <main className='grid grid-cols-3 gap-4 p-4 mt-4 h-full'>
          <CardMarket />
          <CardMarket />
          <CardMarket />
          <CardMarket />
        </main>
      
    </> 
  );
};

export default MarketPage;