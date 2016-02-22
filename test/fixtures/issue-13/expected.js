import React, { PropTypes } from "react";
import cx from "classnames";
import { getComponentClassName } from "utils/ComponentsUtils";
import "./UnverifiedDataToggle.scss";

const UnverifiedDataToggle = ({ className, value, onChange }) => {
	const ccn = getComponentClassName("unverified-data-toggle");

	return <label className={cx(ccn(), value && ccn("--selected"), className)}>
			<input type="checkbox" className={ccn("checkbox")} checked={value} onChange={onChange} />
			Include unverified data
		</label>;
};

UnverifiedDataToggle.defaultProps = {
	value: false,
	onChange: _.noop
};

export default UnverifiedDataToggle;
