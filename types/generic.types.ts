// CRUDService interface for generic CRUD operations, A is the type of the data being managed and T is the object type for the service.
export interface CRUDService<T, A> {
  create(data: A): Promise<T>;
  read(id: number): Promise<T | null>;
  update(id: number, data: A): Promise<T | null>;
  delete(id: number): Promise<void>;
  list(): Promise<T[]>;
}
// DTOGeneric interface for converting data from one type to another, T is the source type and A is the target class which is the class itself.
export interface DTOGeneric<T, A> {
  from(data: T): A;
}
