/**
 * This class is generated by jOOQ
 */
package generated;


import javax.annotation.Generated;

import org.jooq.Sequence;
import org.jooq.impl.SequenceImpl;


/**
 * Convenience access to all sequences in public
 */
@Generated(
	value = {
		"http://www.jooq.org",
		"jOOQ version:3.7.4"
	},
	comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Sequences {

	/**
	 * The sequence <code>public.system_sequence_4436fc91_67cd_41bd_9918_beb28577de2c</code>
	 */
	public static final Sequence<Long> SYSTEM_SEQUENCE_4436FC91_67CD_41BD_9918_BEB28577DE2C = new SequenceImpl<Long>("system_sequence_4436fc91_67cd_41bd_9918_beb28577de2c", Public.PUBLIC, org.jooq.impl.SQLDataType.BIGINT);

	/**
	 * The sequence <code>public.system_sequence_b461390d_75c1_441a_b904_39aeae63f52b</code>
	 */
	public static final Sequence<Long> SYSTEM_SEQUENCE_B461390D_75C1_441A_B904_39AEAE63F52B = new SequenceImpl<Long>("system_sequence_b461390d_75c1_441a_b904_39aeae63f52b", Public.PUBLIC, org.jooq.impl.SQLDataType.BIGINT);
}
