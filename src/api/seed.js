import { v4 as uuidv4 } from 'uuid';
import db from '../db/dexie';
import { randomName, randomEmail, randomTags } from '../utils/faker-data';


export async function seedIfNeeded() {
const jobsCount = await db.jobs.count();
if (jobsCount > 0) return;


// create 25 jobs
const jobs = Array.from({length:25}).map((_,i)=>{
const id = i+1;
return {
id,
title: `Job Title ${id}`,
slug: `job-title-${id}`,
status: Math.random()>0.8? 'archived':'active',
tags: randomTags(),
order: id
}
});
await db.jobs.bulkAdd(jobs);


// create candidates 1000
const stages = ['applied','screen','tech','offer','hired','rejected'];
const candidates = Array.from({length:1000}).map((_,i)=>{
const id = i+1;
const jobId = Math.floor(Math.random()*25)+1;
return {
id,
name: randomName(),
email: randomEmail(),
jobId,
stage: stages[Math.floor(Math.random()*stages.length)]
}
});
await db.candidates.bulkAdd(candidates);


// assessments: 3 sample
for (let j=1;j<=3;j++){
const jobId = j;
const data = {title:`Assessment ${j}`, sections:[{title:'General',questions:[]}]};
for (let q=1;q<=12;q++){
data.sections[0].questions.push({id:`q${q}`,type: q%4===0? 'long':'short',label:`Question ${q}`,required: q%3===0});
}
await db.assessments.put({jobId,data});
}
}