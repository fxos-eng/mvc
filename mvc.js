/**
 * Model
 */
export class Model {
	constructor(properties) {
		properties = properties || {};

		for (var key in properties) {
			this[key] = properties[key];
		}

		this.observableProperties = {};

		Object.observe(this, (changes) => {
			changes.forEach((change) => {
				var handlers = this.observableProperties[change.name];
				if (handlers) {
					handlers.forEach((handler) => {
						handler(change);
					});
				}
			});
		});
	}

	on(property, handler) {
		if (typeof handler !== 'function') {
			return;
		}

		if (!this.observableProperties[property]) {
			ObserveUtils.defineObservableProperties(this, property);
			this.observableProperties[property] = [];
		}

		this.observableProperties[property].push(handler);
	}
}

/**
 * View
 */
var events = {};

export class View {
	constructor(options) {
		options = options || {};

		for (var key in options) {
			this[key] = options[key];
		}

		if (!this.el) {
			this.el = document.createElement('div');
		}
	}

	/**
	 * Initializes an instance with the specified controller.
	 *
	 * @param  {Controller} controller
	 * @return {View}
	 */
	init(controller) {
		this.controller = controller;

		return this;
	}

	/**
	 * Render the default template.
	 */
	render() {
		this.el.innerHTML = this.template();
	}

	/**
	 * Override to provide a function that returns the template string.
	 *
	 * @return {String}
	 */
	template() {
		return '';
	}

	/**
	 * Finds a single child element using the specified selector.
	 *
	 * @param  {String} query
	 * @return {Element | null}
	 */
	$(selector) {
		return this.el.querySelector(selector);
	}

	/**
	 * Finds all child elements using the specified selector.
	 *
	 * @param  {String} query
	 * @return {NodeList}
	 */
	$$(selector) {
		return this.el.querySelectorAll(selector);
	}

	/**
	 *
	 *
	 */
	on(type, selector, handler) {
		if (!events[type]) {
			events[type] = [];
			window.addEventListener(type, delegateHandler, true);
		}

		events[type].push({
			selector: selector,
			handler: handler
		});
	}

	/**
	 *
	 *
	 */
	off(type, selector, handler) {
		if (!events[type]) {
			return;
		}

		events[type] = events[type].filter((delegate) => {
			if (typeof handler === 'function') {
				return delegate.selector !== selector ||
							 delegate.handler  !== handler;
			}

			return delegate.selector !== selector;
		});
	}
}

function delegateHandler(event) {
	var target = event.target;

	events[event.type].forEach((delegate) => {
		if (target.matches(delegate.selector)) {
			delegate.handler.call(target, event);
		}
	});
}

/**
 * Controller
 */
export class Controller {
	constructor(options) {
		options = options || {};

		for (var key in options) {
			this[key] = options[key];
		}

		// Initialize the view (if applicable) when the
		// controller is instantiated.
		if (this.view && typeof this.view.init === 'function') {
			this.view.init(this);
		}
	}
}
