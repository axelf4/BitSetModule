/**
 * Represents a BitSet module.
 *
 * @param {Object} stdlib A standard library object.
 * @param {Object} foreign A foreign function interface.
 * @param {ArrayBuffer} heap A heap buffer.
 * @return {{isset: BitSetModule~isset, set: BitSetModule#set, reset: BitSetModule~reset, clear: BitSetModule~clear, cardinality: BitSetModule~cardinality, contains: BitSetModule~cardinality}}
 */
function BitSetModule(stdlib, foreign, heap) {
	"use asm";
	var arr = new stdlib.Uint8Array(heap); // MEM8

	/**
	 * Returns the value of the bit with the specified index.
	 *
	 * @param ptr The bitset.
	 * @param i The index of the bit.
	 * @return Whether or not the bit is set.
	 */
	function isset(ptr, i) {
		ptr = ptr | 0;
		i = i | 0;
		return arr[ptr + (i >>> 3) | 0] & 1 << (i & 7);
	}

	/**
	 * Sets the bit with the specified index.
	 *
	 * @param ptr The bitset.
	 * @param i The index of the bit to set.
	 */
	function set(ptr, i) {
		ptr = ptr | 0;
		i = i | 0;
		arr[ptr + (i >>> 3) | 0] = arr[ptr + (i >>> 3) | 0] | 1 << (i & 7);
	}

	/**
	 * Resets (to zero) the bit with the specified index.
	 *
	 * @param ptr The bitset.
	 * @param i The index of the bit to reset.
	 */
	function reset(ptr, i) {
		ptr = ptr | 0;
		i = i | 0;
		arr[ptr + (i >>> 3) | 0] = arr[ptr + (i >>> 3) | 0] & ~(1 << (i & 7));
	}


	/**
	 * Resets (to zero) all bits.
	 *
	 * @param ptr The bitset.
	 * @param length The length of the bitset in bytes.
	 */
	function clear(ptr, length) {
		ptr = ptr | 0;
		length = length | 0;
		var i = 0;
		for (; (i|0) < (length|0); i = (i + 1) | 0) {
			arr[ptr + i | 0] = 0;
		}
	}

	/**
	 * Returns the number of set bits.
	 *
	 * @param ptr The bitset.
	 * @param plim A pointer to the location one byte after the end of the bitset.
	 * @return The number of set bits.
	 */
	function cardinality(ptr, plim) {
		ptr = ptr | 0;
		plim = plim | 0;
		var count = 0, j = 0;
		for (; (ptr|0) < (plim|0); ptr = ptr + 1 | 0) {
			j = arr[ptr] | 0;
			j = j - ((j >>> 1) & 0x55) | 0;
			j = (j & 0x33) + ((j >>> 2) & 0x33) | 0;
			count = count + (j + (j >>> 4) & 0x0F) | 0;
		}
		return count | 0;
	}

	/**
	 * Returns whether b is a subset of a.
	 *
	 e This function checks whether all set bits in b are set in a.
	 * a has to be of at least equal size to b.
	 * @param a The bitset.
	 * @param b The other bitset.
	 * @param length The length of b in bytes.
	 * @return Whether b is a subset of a.
	 */
	function contains(a, b, length) {
		a = a | 0;
		b = b | 0;
		length = length | 0;
		var i = 0;
		for (; (i | 0) < (length | 0); i = i + 1 | 0) {
			if (arr[b + i | 0] & ~arr[a + i | 0]) {
				return 0;
			}
		}
		return 1;
	}

	return {
		isset: isset,
		set: set,
		reset: reset,
		clear: clear,
		cardinality: cardinality,
		contains: contains,
	};
}
