const first = ['Amit','Viren','Sana','Riya','Ajay','Kiran','Rohan','Neha','Anil','Pooja'];
const last = ['Shah','Patel','Bagul','Kumar','Joshi','Desai','Singh','Naik'];
const tags = [['react','frontend'],['node','backend'],['design'],['hr'],['devops']];


export function randomName(){
return `${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}`;
}
export function randomEmail(){
const a = Math.random().toString(36).substring(2,8);
return `${a}@example.com`;
}
export function randomTags(){
return tags[Math.floor(Math.random()*tags.length)];
}