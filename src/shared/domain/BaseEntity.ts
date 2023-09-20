export default abstract class BaseEntity {
  abstract toPrimitives(): Record<string, unknown>;
}