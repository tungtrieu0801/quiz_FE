import axiosInstance from "./axiosInstance";

export async function getQuestions(params: any) {
  const res = await axiosInstance.get(
    `/questions?certificationId=${params.certificationId}&domainId=${params.domainId}&language=${params.language}&page=${params.page}&limit=${params.limit}&sortBy=${params.sortBy}&order=${params.order}`
  );
  console.log("Data quétion", res)
  return res.data;
}