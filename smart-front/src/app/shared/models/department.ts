
export class Department {
    public name: string;
    public plant: string;
    public _id: string;

    public constructor(fields ?: {
  name?: string,
  plant?: string,
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}