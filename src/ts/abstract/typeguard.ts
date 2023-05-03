import {TClass} from '@base/constants/types';

/**
 * Non-Instantiatable Class that allows for a while range of Safe Checks
 * & Type Guards across basic and advanced data types.
 *
 */
export abstract class TypeGuard {
  /**
   * Assigns an unknown type to the expected data type.
   * @param t the requested Instantiatable data type.
   * @returns the instance of t
   */
  public static cast<T, U>(t: T): U {
    return t as unknown as U;
  }

  /**
   * Checks to see if the unknown instance belongs to the expected Data Type
   * @param TheClass The expected Data Type we believe the object is
   * @param obj the unknown instance of a data type
   * @returns the unknown object as an instance of the passed Data Type,
   * otherwise, a logicial Error is thrown.
   */
  public static assertInstance<T>(TheClass: TClass<T>, obj: unknown): T {
    if (!(obj instanceof TheClass)) {
      throw Error(
        'Code Responsibly Type Guard Error: Value passed is not an instance of ' +
          TheClass
      );
    }
    return obj;
  }

  /**
   * Checks the instance if it is Null or Undefined.
   * @param value instance to check against nullable data.
   * @returns nonnullable value if it is in fact not empty or throws an error.
   */
  public static guardForNull<T>(value: T): NonNullable<T> {
    this.assertValueEmpty(value);
    return value;
  }

  /**
   * Checks against Null or Undefined.  Not to be used for string data type.
   * @param value instance to check against nullable data.
   * @returns true if the value is empty
   */
  public static isValueEmpty<T>(value: T): value is NonNullable<T> {
    return value == null || value == undefined ? true : false;
  }

  /**
   * Assets if the value is Null and only throws an error.
   * Method meets conditions for GTS / ESLint to guard against null.
   * @param value instance to check against nullable data.
   */
  protected static assertValueEmpty<T>(
    value: T
  ): asserts value is NonNullable<T> {
    if (value == null || value == undefined) {
      throw Error('Code Responsibly Type Guard Error:' + value);
    }
  }
}
