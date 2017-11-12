import * as _ from 'underscore';
import { util } from './util';

type BucketEntry<K, V> = [K, V];
type Bucket<K, V> = BucketEntry<K, V>[];

export class HashMap<K, V> {
  private map: { [key: string]: Bucket<K, V> } = {};

  // Flag to indicate whether to use equality or identity
  private useIdentity: boolean;

  constructor(useIdentity?: boolean) {
    if (useIdentity) this.useIdentity = true;
    else this.useIdentity = false;
  }

  set(key: K, val: V): void {
    let bucket: Bucket<K, V> = this.getBucket(key);
    let i: number = this.findKeyInBucket(key, bucket);

    if (i >= 0) bucket[i][1] = val;
    else bucket.push([key, val]);
  }


  get(key: K): V {
    let bucket: Bucket<K, V> = this.getBucket(key);
    let i: number = this.findKeyInBucket(key, bucket);

    if (i >= 0) return bucket[i][1];
    else return null;
  }

  contains(key: K): boolean {
    let bucket: Bucket<K, V> = this.getBucket(key);
    return this.findKeyInBucket(key, bucket) >= 0;
  }

  keys(): K[] {
    let keys: K[] = [];
    for (let hash in this.map) {
      let bucket: Bucket<K, V> = this.map[hash];
      for (let i: number = 0; i < bucket.length; ++i) {
        keys.push(bucket[i][0]);
      }
    }
    return keys;
  }

  private getBucket(key: K): Bucket<K, V> {
    let hash: string = util.hashCode(key);

    // Create bucket if it doesn't exist.
    if (!(hash in this.map)) this.map[hash] = [];

    return this.map[hash];
  }

  // Returns the index of key within bucket.
  // Returns -1 if key not found.
  private findKeyInBucket(key: K, bucket: Bucket<K, V>): number {
    for (let i: number = 0; i < bucket.length; ++i) {
      if (this.isEqual(key, bucket[i][0])) {
        return i;
      }
    }
    return -1;
  }

  private isEqual(a: any, b: any): boolean {
    if (this.useIdentity) return a === b;
    else return _.isEqual(a, b);
  }

}
