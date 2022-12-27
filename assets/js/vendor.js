function map(value, iStart, iStop, oStart, oStop) {
  return oStart + (oStop - oStart) * ((value - iStart) / (iStop - iStart));
}
function isNumber(subject) {
  return typeof subject === "number";
}
function isObject(subject) {
  return Object.prototype.toString.call(subject) === "[object Object]";
}
function isArray(subject) {
  return Array.isArray(subject);
}
function isRecord(subject) {
  return isObject(subject) || isArray(subject);
}
function mathAbs(n2) {
  return Math.abs(n2);
}
function mathSign(n2) {
  return !n2 ? 0 : n2 / mathAbs(n2);
}
function deltaAbs(valueB, valueA) {
  return mathAbs(valueB - valueA);
}
function factorAbs(valueB, valueA) {
  if (valueB === 0 || valueA === 0)
    return 0;
  if (mathAbs(valueB) <= mathAbs(valueA))
    return 0;
  var diff = deltaAbs(mathAbs(valueB), mathAbs(valueA));
  return mathAbs(diff / valueB);
}
function roundToDecimals(decimalPoints) {
  var pow = Math.pow(10, decimalPoints);
  return function(n2) {
    return Math.round(n2 * pow) / pow;
  };
}
function arrayKeys(array) {
  return objectKeys(array).map(Number);
}
function arrayLast(array) {
  return array[arrayLastIndex(array)];
}
function arrayLastIndex(array) {
  return Math.max(0, array.length - 1);
}
function objectKeys(object) {
  return Object.keys(object);
}
function objectsMergeDeep(objectA, objectB) {
  return [objectA, objectB].reduce(function(mergedObjects, currentObject) {
    objectKeys(currentObject).forEach(function(key) {
      var valueA = mergedObjects[key];
      var valueB = currentObject[key];
      var areObjects = isObject(valueA) && isObject(valueB);
      mergedObjects[key] = areObjects ? objectsMergeDeep(valueA, valueB) : valueB;
    });
    return mergedObjects;
  }, {});
}
function objectsAreEqual(objectA, objectB) {
  var objectAKeys = objectKeys(objectA);
  var objectBKeys = objectKeys(objectB);
  if (objectAKeys.length !== objectBKeys.length)
    return false;
  return objectAKeys.every(function(key) {
    var valueA = objectA[key];
    var valueB = objectB[key];
    if (typeof valueA === "function")
      return "".concat(valueA) === "".concat(valueB);
    if (!isRecord(valueA) || !isRecord(valueB))
      return valueA === valueB;
    return objectsAreEqual(valueA, valueB);
  });
}
function Alignment(align, viewSize) {
  var predefined = {
    start,
    center,
    end
  };
  function start() {
    return 0;
  }
  function center(n2) {
    return end(n2) / 2;
  }
  function end(n2) {
    return viewSize - n2;
  }
  function percent() {
    return viewSize * Number(align);
  }
  function measure(n2) {
    if (isNumber(align))
      return percent();
    return predefined[align](n2);
  }
  var self2 = {
    measure
  };
  return self2;
}
function Animation(callback) {
  var animationFrame = 0;
  function ifAnimating(active, cb) {
    return function() {
      if (active === !!animationFrame)
        cb();
    };
  }
  function start() {
    animationFrame = window.requestAnimationFrame(callback);
  }
  function stop() {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
  var self2 = {
    proceed: ifAnimating(true, start),
    start: ifAnimating(false, start),
    stop: ifAnimating(true, stop)
  };
  return self2;
}
function Axis(axis, direction) {
  var scroll = axis === "y" ? "y" : "x";
  var cross = axis === "y" ? "x" : "y";
  var startEdge = getStartEdge();
  var endEdge = getEndEdge();
  function measureSize(rect) {
    var width = rect.width, height = rect.height;
    return scroll === "x" ? width : height;
  }
  function getStartEdge() {
    if (scroll === "y")
      return "top";
    return direction === "rtl" ? "right" : "left";
  }
  function getEndEdge() {
    if (scroll === "y")
      return "bottom";
    return direction === "rtl" ? "left" : "right";
  }
  var self2 = {
    scroll,
    cross,
    startEdge,
    endEdge,
    measureSize
  };
  return self2;
}
function Limit(min, max) {
  var length = mathAbs(min - max);
  function reachedMin(n2) {
    return n2 < min;
  }
  function reachedMax(n2) {
    return n2 > max;
  }
  function reachedAny(n2) {
    return reachedMin(n2) || reachedMax(n2);
  }
  function constrain(n2) {
    if (!reachedAny(n2))
      return n2;
    return reachedMin(n2) ? min : max;
  }
  function removeOffset(n2) {
    if (!length)
      return n2;
    return n2 - length * Math.ceil((n2 - max) / length);
  }
  var self2 = {
    length,
    max,
    min,
    constrain,
    reachedAny,
    reachedMax,
    reachedMin,
    removeOffset
  };
  return self2;
}
function Counter(max, start, loop) {
  var _a = Limit(0, max), min = _a.min, constrain = _a.constrain;
  var loopEnd = max + 1;
  var counter = withinLimit(start);
  function withinLimit(n2) {
    return !loop ? constrain(n2) : mathAbs((loopEnd + n2) % loopEnd);
  }
  function get() {
    return counter;
  }
  function set(n2) {
    counter = withinLimit(n2);
    return self2;
  }
  function add(n2) {
    return set(get() + n2);
  }
  function clone() {
    return Counter(max, get(), loop);
  }
  var self2 = {
    add,
    clone,
    get,
    set,
    min,
    max
  };
  return self2;
}
function Direction(direction) {
  var sign = direction === "rtl" ? -1 : 1;
  function apply(n2) {
    return n2 * sign;
  }
  var self2 = {
    apply
  };
  return self2;
}
function EventStore() {
  var listeners = [];
  function add(node, type, handler, options) {
    if (options === void 0) {
      options = false;
    }
    node.addEventListener(type, handler, options);
    listeners.push(function() {
      return node.removeEventListener(type, handler, options);
    });
    return self2;
  }
  function removeAll() {
    listeners = listeners.filter(function(remove) {
      return remove();
    });
    return self2;
  }
  var self2 = {
    add,
    removeAll
  };
  return self2;
}
function Vector1D(value) {
  var vector = value;
  function get() {
    return vector;
  }
  function set(n2) {
    vector = readNumber(n2);
    return self2;
  }
  function add(n2) {
    vector += readNumber(n2);
    return self2;
  }
  function subtract(n2) {
    vector -= readNumber(n2);
    return self2;
  }
  function multiply(n2) {
    vector *= n2;
    return self2;
  }
  function divide(n2) {
    vector /= n2;
    return self2;
  }
  function normalize() {
    if (vector !== 0)
      divide(vector);
    return self2;
  }
  function readNumber(n2) {
    return isNumber(n2) ? n2 : n2.get();
  }
  var self2 = {
    add,
    divide,
    get,
    multiply,
    normalize,
    set,
    subtract
  };
  return self2;
}
function DragHandler(axis, direction, rootNode, target, dragTracker, location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, loop, dragFree, skipSnaps) {
  var crossAxis = axis.cross;
  var focusNodes = ["INPUT", "SELECT", "TEXTAREA"];
  var dragStartPoint = Vector1D(0);
  var activationEvents = EventStore();
  var interactionEvents = EventStore();
  var dragThreshold = percentOfView.measure(20);
  var snapForceBoost = {
    mouse: 300,
    touch: 400
  };
  var freeForceBoost = {
    mouse: 500,
    touch: 600
  };
  var baseSpeed = dragFree ? 5 : 16;
  var baseMass = 1;
  var startScroll = 0;
  var startCross = 0;
  var pointerIsDown = false;
  var preventScroll = false;
  var preventClick = false;
  var isMouse = false;
  function addActivationEvents() {
    var node = rootNode;
    activationEvents.add(node, "touchmove", function() {
      return void 0;
    }).add(node, "touchend", function() {
      return void 0;
    }).add(node, "touchstart", down).add(node, "mousedown", down).add(node, "touchcancel", up).add(node, "contextmenu", up).add(node, "click", click);
  }
  function addInteractionEvents() {
    var node = !isMouse ? rootNode : document;
    interactionEvents.add(node, "touchmove", move).add(node, "touchend", up).add(node, "mousemove", move).add(node, "mouseup", up);
  }
  function removeAllEvents() {
    activationEvents.removeAll();
    interactionEvents.removeAll();
  }
  function isFocusNode(node) {
    var name = node.nodeName || "";
    return focusNodes.indexOf(name) > -1;
  }
  function forceBoost() {
    var boost = dragFree ? freeForceBoost : snapForceBoost;
    var type = isMouse ? "mouse" : "touch";
    return boost[type];
  }
  function allowedForce(force, targetChanged) {
    var next = index.clone().add(mathSign(force) * -1);
    var isEdge = next.get() === index.min || next.get() === index.max;
    var baseForce = scrollTarget.byDistance(force, !dragFree).distance;
    if (dragFree || mathAbs(force) < dragThreshold)
      return baseForce;
    if (!loop && isEdge)
      return baseForce * 0.4;
    if (skipSnaps && targetChanged)
      return baseForce * 0.5;
    return scrollTarget.byIndex(next.get(), 0).distance;
  }
  function down(evt) {
    isMouse = evt.type === "mousedown";
    if (isMouse && evt.button !== 0)
      return;
    var isMoving = deltaAbs(target.get(), location.get()) >= 2;
    var clearPreventClick = isMouse || !isMoving;
    var isNotFocusNode = !isFocusNode(evt.target);
    var preventDefault = isMoving || isMouse && isNotFocusNode;
    pointerIsDown = true;
    dragTracker.pointerDown(evt);
    dragStartPoint.set(target);
    target.set(location);
    scrollBody.useBaseMass().useSpeed(80);
    addInteractionEvents();
    startScroll = dragTracker.readPoint(evt);
    startCross = dragTracker.readPoint(evt, crossAxis);
    eventHandler.emit("pointerDown");
    if (clearPreventClick)
      preventClick = false;
    if (preventDefault)
      evt.preventDefault();
  }
  function move(evt) {
    if (!preventScroll && !isMouse) {
      if (!evt.cancelable)
        return up(evt);
      var lastScroll = dragTracker.readPoint(evt);
      var lastCross = dragTracker.readPoint(evt, crossAxis);
      var diffScroll = deltaAbs(lastScroll, startScroll);
      var diffCross = deltaAbs(lastCross, startCross);
      preventScroll = diffScroll > diffCross;
      if (!preventScroll && !preventClick)
        return up(evt);
    }
    var diff = dragTracker.pointerMove(evt);
    if (!preventClick && diff)
      preventClick = true;
    animation.start();
    target.add(direction.apply(diff));
    evt.preventDefault();
  }
  function up(evt) {
    var currentLocation = scrollTarget.byDistance(0, false);
    var targetChanged = currentLocation.index !== index.get();
    var rawForce = dragTracker.pointerUp(evt) * forceBoost();
    var force = allowedForce(direction.apply(rawForce), targetChanged);
    var forceFactor = factorAbs(rawForce, force);
    var isMoving = deltaAbs(target.get(), dragStartPoint.get()) >= 0.5;
    var isVigorous = targetChanged && forceFactor > 0.75;
    var isBelowThreshold = mathAbs(rawForce) < dragThreshold;
    var speed = isVigorous ? 10 : baseSpeed;
    var mass = isVigorous ? baseMass + 2.5 * forceFactor : baseMass;
    if (isMoving && !isMouse)
      preventClick = true;
    preventScroll = false;
    pointerIsDown = false;
    interactionEvents.removeAll();
    scrollBody.useSpeed(isBelowThreshold ? 9 : speed).useMass(mass);
    scrollTo.distance(force, !dragFree);
    isMouse = false;
    eventHandler.emit("pointerUp");
  }
  function click(evt) {
    if (preventClick)
      evt.preventDefault();
  }
  function clickAllowed() {
    return !preventClick;
  }
  function pointerDown() {
    return pointerIsDown;
  }
  var self2 = {
    addActivationEvents,
    clickAllowed,
    pointerDown,
    removeAllEvents
  };
  return self2;
}
function DragTracker(axis) {
  var logInterval = 170;
  var startEvent;
  var lastEvent;
  function isTouchEvent(evt) {
    return typeof TouchEvent !== "undefined" && evt instanceof TouchEvent;
  }
  function readTime(evt) {
    return evt.timeStamp;
  }
  function readPoint(evt, evtAxis) {
    var property = evtAxis || axis.scroll;
    var coord = "client".concat(property === "x" ? "X" : "Y");
    return (isTouchEvent(evt) ? evt.touches[0] : evt)[coord];
  }
  function pointerDown(evt) {
    startEvent = evt;
    lastEvent = evt;
    return readPoint(evt);
  }
  function pointerMove(evt) {
    var diff = readPoint(evt) - readPoint(lastEvent);
    var expired = readTime(evt) - readTime(startEvent) > logInterval;
    lastEvent = evt;
    if (expired)
      startEvent = evt;
    return diff;
  }
  function pointerUp(evt) {
    if (!startEvent || !lastEvent)
      return 0;
    var diffDrag = readPoint(lastEvent) - readPoint(startEvent);
    var diffTime = readTime(evt) - readTime(startEvent);
    var expired = readTime(evt) - readTime(lastEvent) > logInterval;
    var force = diffDrag / diffTime;
    var isFlick = diffTime && !expired && mathAbs(force) > 0.1;
    return isFlick ? force : 0;
  }
  var self2 = {
    isTouchEvent,
    pointerDown,
    pointerMove,
    pointerUp,
    readPoint
  };
  return self2;
}
function PercentOfView(viewSize) {
  function measure(n2) {
    return viewSize * (n2 / 100);
  }
  var self2 = {
    measure
  };
  return self2;
}
function ScrollBody(location, baseSpeed, baseMass) {
  var roundToTwoDecimals = roundToDecimals(2);
  var velocity = Vector1D(0);
  var acceleration = Vector1D(0);
  var attraction = Vector1D(0);
  var attractionDirection = 0;
  var speed = baseSpeed;
  var mass = baseMass;
  function update() {
    velocity.add(acceleration);
    location.add(velocity);
    acceleration.multiply(0);
  }
  function applyForce(force) {
    force.divide(mass);
    acceleration.add(force);
  }
  function seek(target) {
    attraction.set(target).subtract(location);
    var magnitude = map(attraction.get(), 0, 100, 0, speed);
    attractionDirection = mathSign(attraction.get());
    attraction.normalize().multiply(magnitude).subtract(velocity);
    applyForce(attraction);
    return self2;
  }
  function settle(target) {
    var diff = target.get() - location.get();
    var hasSettled = !roundToTwoDecimals(diff);
    if (hasSettled)
      location.set(target);
    return hasSettled;
  }
  function direction() {
    return attractionDirection;
  }
  function useBaseSpeed() {
    return useSpeed(baseSpeed);
  }
  function useBaseMass() {
    return useMass(baseMass);
  }
  function useSpeed(n2) {
    speed = n2;
    return self2;
  }
  function useMass(n2) {
    mass = n2;
    return self2;
  }
  var self2 = {
    direction,
    seek,
    settle,
    update,
    useBaseMass,
    useBaseSpeed,
    useMass,
    useSpeed
  };
  return self2;
}
function ScrollBounds(limit, location, target, scrollBody, percentOfView) {
  var pullBackThreshold = percentOfView.measure(10);
  var edgeOffsetTolerance = percentOfView.measure(50);
  var maxFriction = 0.85;
  var disabled = false;
  function shouldConstrain() {
    if (disabled)
      return false;
    if (!limit.reachedAny(target.get()))
      return false;
    if (!limit.reachedAny(location.get()))
      return false;
    return true;
  }
  function constrain(pointerDown) {
    if (!shouldConstrain())
      return;
    var edge = limit.reachedMin(location.get()) ? "min" : "max";
    var diffToEdge = mathAbs(limit[edge] - location.get());
    var diffToTarget = target.get() - location.get();
    var friction = Math.min(diffToEdge / edgeOffsetTolerance, maxFriction);
    target.subtract(diffToTarget * friction);
    if (!pointerDown && mathAbs(diffToTarget) < pullBackThreshold) {
      target.set(limit.constrain(target.get()));
      scrollBody.useSpeed(10).useMass(3);
    }
  }
  function toggleActive(active) {
    disabled = !active;
  }
  var self2 = {
    constrain,
    toggleActive
  };
  return self2;
}
function ScrollContain(viewSize, contentSize, snapsAligned, containScroll) {
  var scrollBounds = Limit(-contentSize + viewSize, snapsAligned[0]);
  var snapsBounded = snapsAligned.map(scrollBounds.constrain);
  var snapsContained = measureContained();
  function findDuplicates() {
    var startSnap = snapsBounded[0];
    var endSnap = arrayLast(snapsBounded);
    var min = snapsBounded.lastIndexOf(startSnap);
    var max = snapsBounded.indexOf(endSnap) + 1;
    return Limit(min, max);
  }
  function measureContained() {
    if (contentSize <= viewSize)
      return [scrollBounds.max];
    if (containScroll === "keepSnaps")
      return snapsBounded;
    var _a = findDuplicates(), min = _a.min, max = _a.max;
    return snapsBounded.slice(min, max);
  }
  var self2 = {
    snapsContained
  };
  return self2;
}
function ScrollLimit(contentSize, scrollSnaps, loop) {
  var limit = measureLimit();
  function measureLimit() {
    var startSnap = scrollSnaps[0];
    var endSnap = arrayLast(scrollSnaps);
    var min = loop ? startSnap - contentSize : endSnap;
    var max = startSnap;
    return Limit(min, max);
  }
  var self2 = {
    limit
  };
  return self2;
}
function ScrollLooper(contentSize, limit, location, vectors) {
  var jointSafety = 0.1;
  var min = limit.min + jointSafety;
  var max = limit.max + jointSafety;
  var _a = Limit(min, max), reachedMin = _a.reachedMin, reachedMax = _a.reachedMax;
  function shouldLoop(direction) {
    if (direction === 1)
      return reachedMax(location.get());
    if (direction === -1)
      return reachedMin(location.get());
    return false;
  }
  function loop(direction) {
    if (!shouldLoop(direction))
      return;
    var loopDistance = contentSize * (direction * -1);
    vectors.forEach(function(v2) {
      return v2.add(loopDistance);
    });
  }
  var self2 = {
    loop
  };
  return self2;
}
function ScrollProgress(limit) {
  var max = limit.max, scrollLength = limit.length;
  function get(n2) {
    var currentLocation = n2 - max;
    return currentLocation / -scrollLength;
  }
  var self2 = {
    get
  };
  return self2;
}
function ScrollSnaps(axis, alignment, containerRect, slideRects, slideSizesWithGaps, slidesToScroll, containScroll) {
  var startEdge = axis.startEdge, endEdge = axis.endEdge;
  var groupSlides = slidesToScroll.groupSlides;
  var alignments = measureSizes().map(alignment.measure);
  var snaps = measureUnaligned();
  var snapsAligned = measureAligned();
  function measureSizes() {
    return groupSlides(slideRects).map(function(rects) {
      return arrayLast(rects)[endEdge] - rects[0][startEdge];
    }).map(mathAbs);
  }
  function measureUnaligned() {
    return slideRects.map(function(rect) {
      return containerRect[startEdge] - rect[startEdge];
    }).map(function(snap) {
      return -mathAbs(snap);
    });
  }
  function measureAligned() {
    var containedStartSnap = 0;
    var containedEndSnap = arrayLast(snaps) - arrayLast(slideSizesWithGaps);
    return groupSlides(snaps).map(function(g2) {
      return g2[0];
    }).map(function(snap, index, groupedSnaps) {
      var isFirst = !index;
      var isLast = index === arrayLastIndex(groupedSnaps);
      if (containScroll && isFirst)
        return containedStartSnap;
      if (containScroll && isLast)
        return containedEndSnap;
      return snap + alignments[index];
    });
  }
  var self2 = {
    snaps,
    snapsAligned
  };
  return self2;
}
function ScrollTarget(loop, scrollSnaps, contentSize, limit, targetVector) {
  var reachedAny = limit.reachedAny, removeOffset = limit.removeOffset, constrain = limit.constrain;
  function minDistance(distances) {
    return distances.concat().sort(function(a2, b2) {
      return mathAbs(a2) - mathAbs(b2);
    })[0];
  }
  function findTargetSnap(target) {
    var distance = loop ? removeOffset(target) : constrain(target);
    var ascDiffsToSnaps = scrollSnaps.map(function(scrollSnap) {
      return scrollSnap - distance;
    }).map(function(diffToSnap) {
      return shortcut(diffToSnap, 0);
    }).map(function(diff, i2) {
      return {
        diff,
        index: i2
      };
    }).sort(function(d1, d2) {
      return mathAbs(d1.diff) - mathAbs(d2.diff);
    });
    var index = ascDiffsToSnaps[0].index;
    return {
      index,
      distance
    };
  }
  function shortcut(target, direction) {
    var targets = [target, target + contentSize, target - contentSize];
    if (!loop)
      return targets[0];
    if (!direction)
      return minDistance(targets);
    var matchingTargets = targets.filter(function(t2) {
      return mathSign(t2) === direction;
    });
    return minDistance(matchingTargets);
  }
  function byIndex(index, direction) {
    var diffToSnap = scrollSnaps[index] - targetVector.get();
    var distance = shortcut(diffToSnap, direction);
    return {
      index,
      distance
    };
  }
  function byDistance(distance, snap) {
    var target = targetVector.get() + distance;
    var _a = findTargetSnap(target), index = _a.index, targetSnapDistance = _a.distance;
    var reachedBound = !loop && reachedAny(target);
    if (!snap || reachedBound)
      return {
        index,
        distance
      };
    var diffToSnap = scrollSnaps[index] - targetSnapDistance;
    var snapDistance = distance + shortcut(diffToSnap, 0);
    return {
      index,
      distance: snapDistance
    };
  }
  var self2 = {
    byDistance,
    byIndex,
    shortcut
  };
  return self2;
}
function ScrollTo(animation, indexCurrent, indexPrevious, scrollTarget, targetVector, eventHandler) {
  function scrollTo(target) {
    var distanceDiff = target.distance;
    var indexDiff = target.index !== indexCurrent.get();
    if (distanceDiff) {
      animation.start();
      targetVector.add(distanceDiff);
    }
    if (indexDiff) {
      indexPrevious.set(indexCurrent.get());
      indexCurrent.set(target.index);
      eventHandler.emit("select");
    }
  }
  function distance(n2, snap) {
    var target = scrollTarget.byDistance(n2, snap);
    scrollTo(target);
  }
  function index(n2, direction) {
    var targetIndex = indexCurrent.clone().set(n2);
    var target = scrollTarget.byIndex(targetIndex.get(), direction);
    scrollTo(target);
  }
  var self2 = {
    distance,
    index
  };
  return self2;
}
function Translate(axis, direction, container) {
  var translate = axis.scroll === "x" ? x2 : y2;
  var containerStyle = container.style;
  var disabled = false;
  function x2(n2) {
    return "translate3d(".concat(n2, "px,0px,0px)");
  }
  function y2(n2) {
    return "translate3d(0px,".concat(n2, "px,0px)");
  }
  function to(target) {
    if (disabled)
      return;
    containerStyle.transform = translate(direction.apply(target.get()));
  }
  function toggleActive(active) {
    disabled = !active;
  }
  function clear() {
    if (disabled)
      return;
    containerStyle.transform = "";
    if (!container.getAttribute("style"))
      container.removeAttribute("style");
  }
  var self2 = {
    clear,
    to,
    toggleActive
  };
  return self2;
}
function SlideLooper(axis, direction, viewSize, contentSize, slideSizesWithGaps, scrollSnaps, slidesInView, scroll, slides) {
  var ascItems = arrayKeys(slideSizesWithGaps);
  var descItems = arrayKeys(slideSizesWithGaps).reverse();
  var loopPoints = startPoints().concat(endPoints());
  function removeSlideSizes(indexes, from) {
    return indexes.reduce(function(a2, i2) {
      return a2 - slideSizesWithGaps[i2];
    }, from);
  }
  function slidesInGap(indexes, gap) {
    return indexes.reduce(function(a2, i2) {
      var remainingGap = removeSlideSizes(a2, gap);
      return remainingGap > 0 ? a2.concat([i2]) : a2;
    }, []);
  }
  function findLoopPoints(indexes, edge) {
    var isStartEdge = edge === "start";
    var offset = isStartEdge ? -contentSize : contentSize;
    var slideBounds = slidesInView.findSlideBounds([offset]);
    return indexes.map(function(index) {
      var initial = isStartEdge ? 0 : -contentSize;
      var altered = isStartEdge ? contentSize : 0;
      var bounds = slideBounds.filter(function(b2) {
        return b2.index === index;
      })[0];
      var point = bounds[isStartEdge ? "end" : "start"];
      var shift = Vector1D(-1);
      var location = Vector1D(-1);
      var translate = Translate(axis, direction, slides[index]);
      var target = function() {
        return shift.set(scroll.get() > point ? initial : altered);
      };
      return {
        index,
        location,
        translate,
        target
      };
    });
  }
  function startPoints() {
    var gap = scrollSnaps[0] - 1;
    var indexes = slidesInGap(descItems, gap);
    return findLoopPoints(indexes, "end");
  }
  function endPoints() {
    var gap = viewSize - scrollSnaps[0] - 1;
    var indexes = slidesInGap(ascItems, gap);
    return findLoopPoints(indexes, "start");
  }
  function canLoop() {
    return loopPoints.every(function(_a) {
      var index = _a.index;
      var otherIndexes = ascItems.filter(function(i2) {
        return i2 !== index;
      });
      return removeSlideSizes(otherIndexes, viewSize) <= 0.1;
    });
  }
  function loop() {
    loopPoints.forEach(function(loopPoint) {
      var target = loopPoint.target, translate = loopPoint.translate, location = loopPoint.location;
      var shift = target();
      if (shift.get() === location.get())
        return;
      if (shift.get() === 0)
        translate.clear();
      else
        translate.to(shift);
      location.set(shift);
    });
  }
  function clear() {
    loopPoints.forEach(function(loopPoint) {
      return loopPoint.translate.clear();
    });
  }
  var self2 = {
    canLoop,
    clear,
    loop,
    loopPoints
  };
  return self2;
}
function SlidesInView(viewSize, contentSize, slideSizes, snaps, limit, loop, inViewThreshold) {
  var removeOffset = limit.removeOffset, constrain = limit.constrain;
  var roundingSafety = 0.5;
  var cachedOffsets = loop ? [0, contentSize, -contentSize] : [0];
  var cachedBounds = findSlideBounds(cachedOffsets, inViewThreshold);
  function findSlideThresholds(threshold) {
    var slideThreshold = threshold || 0;
    return slideSizes.map(function(slideSize) {
      var thresholdLimit = Limit(roundingSafety, slideSize - roundingSafety);
      return thresholdLimit.constrain(slideSize * slideThreshold);
    });
  }
  function findSlideBounds(offsets, threshold) {
    var slideOffsets = offsets || cachedOffsets;
    var slideThresholds = findSlideThresholds(threshold);
    return slideOffsets.reduce(function(list, offset) {
      var bounds = snaps.map(function(snap, index) {
        return {
          start: snap - slideSizes[index] + slideThresholds[index] + offset,
          end: snap + viewSize - slideThresholds[index] + offset,
          index
        };
      });
      return list.concat(bounds);
    }, []);
  }
  function check(location, bounds) {
    var limitedLocation = loop ? removeOffset(location) : constrain(location);
    var slideBounds = bounds || cachedBounds;
    return slideBounds.reduce(function(list, slideBound) {
      var index = slideBound.index, start = slideBound.start, end = slideBound.end;
      var inList = list.indexOf(index) !== -1;
      var inView = start < limitedLocation && end > limitedLocation;
      return !inList && inView ? list.concat([index]) : list;
    }, []);
  }
  var self2 = {
    check,
    findSlideBounds
  };
  return self2;
}
function SlideSizes(axis, containerRect, slideRects, slides, includeEdgeGap) {
  var measureSize = axis.measureSize, startEdge = axis.startEdge, endEdge = axis.endEdge;
  var startGap = measureStartGap();
  var endGap = measureEndGap();
  var slideSizes = slideRects.map(measureSize);
  var slideSizesWithGaps = measureWithGaps();
  function measureStartGap() {
    if (!includeEdgeGap)
      return 0;
    var slideRect = slideRects[0];
    return mathAbs(containerRect[startEdge] - slideRect[startEdge]);
  }
  function measureEndGap() {
    if (!includeEdgeGap)
      return 0;
    var style = window.getComputedStyle(arrayLast(slides));
    return parseFloat(style.getPropertyValue("margin-".concat(endEdge)));
  }
  function measureWithGaps() {
    return slideRects.map(function(rect, index, rects) {
      var isFirst = !index;
      var isLast = index === arrayLastIndex(rects);
      if (isFirst)
        return slideSizes[index] + startGap;
      if (isLast)
        return slideSizes[index] + endGap;
      return rects[index + 1][startEdge] - rect[startEdge];
    }).map(mathAbs);
  }
  var self2 = {
    slideSizes,
    slideSizesWithGaps
  };
  return self2;
}
function SlidesToScroll(viewSize, slideSizesWithGaps, slidesToScroll) {
  var groupByNumber = isNumber(slidesToScroll);
  function byNumber(array, groupSize) {
    return arrayKeys(array).filter(function(i2) {
      return i2 % groupSize === 0;
    }).map(function(i2) {
      return array.slice(i2, i2 + groupSize);
    });
  }
  function bySize(array) {
    return arrayKeys(array).reduce(function(groupSizes, i2) {
      var chunk = slideSizesWithGaps.slice(arrayLast(groupSizes), i2 + 1);
      var chunkSize = chunk.reduce(function(a2, s2) {
        return a2 + s2;
      }, 0);
      return !i2 || chunkSize > viewSize ? groupSizes.concat(i2) : groupSizes;
    }, []).map(function(start, i2, groupSizes) {
      return array.slice(start, groupSizes[i2 + 1]);
    });
  }
  function groupSlides(array) {
    return groupByNumber ? byNumber(array, slidesToScroll) : bySize(array);
  }
  var self2 = {
    groupSlides
  };
  return self2;
}
function Engine(root, container, slides, options, eventHandler) {
  var align = options.align, scrollAxis = options.axis, contentDirection = options.direction, startIndex = options.startIndex, inViewThreshold = options.inViewThreshold, loop = options.loop, speed = options.speed, dragFree = options.dragFree, groupSlides = options.slidesToScroll, skipSnaps = options.skipSnaps, containScroll = options.containScroll;
  var containerRect = container.getBoundingClientRect();
  var slideRects = slides.map(function(slide) {
    return slide.getBoundingClientRect();
  });
  var direction = Direction(contentDirection);
  var axis = Axis(scrollAxis, contentDirection);
  var viewSize = axis.measureSize(containerRect);
  var percentOfView = PercentOfView(viewSize);
  var alignment = Alignment(align, viewSize);
  var containSnaps = !loop && containScroll !== "";
  var includeEdgeGap = loop || containScroll !== "";
  var _a = SlideSizes(axis, containerRect, slideRects, slides, includeEdgeGap), slideSizes = _a.slideSizes, slideSizesWithGaps = _a.slideSizesWithGaps;
  var slidesToScroll = SlidesToScroll(viewSize, slideSizesWithGaps, groupSlides);
  var _b = ScrollSnaps(axis, alignment, containerRect, slideRects, slideSizesWithGaps, slidesToScroll, containSnaps), snaps = _b.snaps, snapsAligned = _b.snapsAligned;
  var contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps);
  var snapsContained = ScrollContain(viewSize, contentSize, snapsAligned, containScroll).snapsContained;
  var scrollSnaps = containSnaps ? snapsContained : snapsAligned;
  var limit = ScrollLimit(contentSize, scrollSnaps, loop).limit;
  var index = Counter(arrayLastIndex(scrollSnaps), startIndex, loop);
  var indexPrevious = index.clone();
  var slideIndexes = arrayKeys(slides);
  var update = function() {
    if (!loop)
      engine.scrollBounds.constrain(engine.dragHandler.pointerDown());
    engine.scrollBody.seek(target).update();
    var settled = engine.scrollBody.settle(target);
    if (settled && !engine.dragHandler.pointerDown()) {
      engine.animation.stop();
      eventHandler.emit("settle");
    }
    if (!settled) {
      eventHandler.emit("scroll");
    }
    if (loop) {
      engine.scrollLooper.loop(engine.scrollBody.direction());
      engine.slideLooper.loop();
    }
    engine.translate.to(location);
    engine.animation.proceed();
  };
  var animation = Animation(update);
  var startLocation = scrollSnaps[index.get()];
  var location = Vector1D(startLocation);
  var target = Vector1D(startLocation);
  var scrollBody = ScrollBody(location, speed, 1);
  var scrollTarget = ScrollTarget(loop, scrollSnaps, contentSize, limit, target);
  var scrollTo = ScrollTo(animation, index, indexPrevious, scrollTarget, target, eventHandler);
  var slidesInView = SlidesInView(viewSize, contentSize, slideSizes, snaps, limit, loop, inViewThreshold);
  var dragHandler = DragHandler(axis, direction, root, target, DragTracker(axis), location, animation, scrollTo, scrollBody, scrollTarget, index, eventHandler, percentOfView, loop, dragFree, skipSnaps);
  var engine = {
    containerRect,
    slideRects,
    animation,
    axis,
    direction,
    dragHandler,
    eventStore: EventStore(),
    percentOfView,
    index,
    indexPrevious,
    limit,
    location,
    options,
    scrollBody,
    scrollBounds: ScrollBounds(limit, location, target, scrollBody, percentOfView),
    scrollLooper: ScrollLooper(contentSize, limit, location, [location, target]),
    scrollProgress: ScrollProgress(limit),
    scrollSnaps,
    scrollTarget,
    scrollTo,
    slideLooper: SlideLooper(axis, direction, viewSize, contentSize, slideSizesWithGaps, scrollSnaps, slidesInView, location, slides),
    slidesToScroll,
    slidesInView,
    slideIndexes,
    target,
    translate: Translate(axis, direction, container)
  };
  return engine;
}
function EventHandler() {
  var listeners = {};
  function getListeners(evt) {
    return listeners[evt] || [];
  }
  function emit(evt) {
    getListeners(evt).forEach(function(e2) {
      return e2(evt);
    });
    return self2;
  }
  function on(evt, cb) {
    listeners[evt] = getListeners(evt).concat([cb]);
    return self2;
  }
  function off(evt, cb) {
    listeners[evt] = getListeners(evt).filter(function(e2) {
      return e2 !== cb;
    });
    return self2;
  }
  var self2 = {
    emit,
    off,
    on
  };
  return self2;
}
var defaultOptions$1 = {
  align: "center",
  axis: "x",
  containScroll: "",
  direction: "ltr",
  slidesToScroll: 1,
  breakpoints: {},
  dragFree: false,
  draggable: true,
  inViewThreshold: 0,
  loop: false,
  skipSnaps: false,
  speed: 10,
  startIndex: 0,
  active: true
};
function OptionsHandler() {
  function merge(optionsA, optionsB) {
    return objectsMergeDeep(optionsA, optionsB || {});
  }
  function areEqual(optionsA, optionsB) {
    var breakpointsA = JSON.stringify(objectKeys(optionsA.breakpoints || {}));
    var breakpointsB = JSON.stringify(objectKeys(optionsB.breakpoints || {}));
    if (breakpointsA !== breakpointsB)
      return false;
    return objectsAreEqual(optionsA, optionsB);
  }
  function atMedia(options) {
    var optionsAtMedia = options.breakpoints || {};
    var matchedMediaOptions = objectKeys(optionsAtMedia).filter(function(media) {
      return window.matchMedia(media).matches;
    }).map(function(media) {
      return optionsAtMedia[media];
    }).reduce(function(a2, mediaOption) {
      return merge(a2, mediaOption);
    }, {});
    return merge(options, matchedMediaOptions);
  }
  var self2 = {
    merge,
    areEqual,
    atMedia
  };
  return self2;
}
function PluginsHandler() {
  var _a = OptionsHandler(), atMedia = _a.atMedia, areEqual = _a.areEqual;
  var activePlugins = [];
  var pluginsChanged = [];
  function haveChanged() {
    return pluginsChanged.some(function(hasChanged2) {
      return hasChanged2();
    });
  }
  function hasChanged(plugin) {
    var options = atMedia(plugin.options);
    return function() {
      return !areEqual(options, atMedia(plugin.options));
    };
  }
  function init(plugins, embla) {
    pluginsChanged = plugins.map(hasChanged);
    activePlugins = plugins.filter(function(plugin) {
      return atMedia(plugin.options).active;
    });
    activePlugins.forEach(function(plugin) {
      return plugin.init(embla);
    });
    return plugins.reduce(function(map2, plugin) {
      var _a2;
      return Object.assign(map2, (_a2 = {}, _a2[plugin.name] = plugin, _a2));
    }, {});
  }
  function destroy() {
    activePlugins = activePlugins.filter(function(plugin) {
      return plugin.destroy();
    });
  }
  var self2 = {
    init,
    destroy,
    haveChanged
  };
  return self2;
}
function EmblaCarousel(nodes, userOptions, userPlugins) {
  var resizeHandlers = EventStore();
  var optionsHandler = OptionsHandler();
  var pluginsHandler = PluginsHandler();
  var eventHandler = EventHandler();
  var on = eventHandler.on, off = eventHandler.off;
  var reInit = reActivate;
  var destroyed = false;
  var engine;
  var optionsBase = optionsHandler.merge(defaultOptions$1, EmblaCarousel.globalOptions);
  var options = optionsHandler.merge(optionsBase);
  var pluginList = [];
  var pluginApis;
  var rootSize = 0;
  var root;
  var container;
  var slides;
  function storeElements() {
    var providedContainer = "container" in nodes && nodes.container;
    var providedSlides = "slides" in nodes && nodes.slides;
    root = "root" in nodes ? nodes.root : nodes;
    container = providedContainer || root.children[0];
    slides = providedSlides || [].slice.call(container.children);
  }
  function activate(withOptions, withPlugins) {
    if (destroyed)
      return;
    storeElements();
    optionsBase = optionsHandler.merge(optionsBase, withOptions);
    options = optionsHandler.atMedia(optionsBase);
    engine = Engine(root, container, slides, options, eventHandler);
    rootSize = engine.axis.measureSize(root.getBoundingClientRect());
    if (!options.active)
      return deActivate();
    engine.translate.to(engine.location);
    pluginList = withPlugins || pluginList;
    pluginApis = pluginsHandler.init(pluginList, self2);
    if (options.loop) {
      if (!engine.slideLooper.canLoop()) {
        deActivate();
        return activate({
          loop: false
        }, withPlugins);
      }
      engine.slideLooper.loop();
    }
    if (options.draggable && container.offsetParent && slides.length) {
      engine.dragHandler.addActivationEvents();
    }
  }
  function reActivate(withOptions, withPlugins) {
    var startIndex = selectedScrollSnap();
    deActivate();
    activate(optionsHandler.merge({
      startIndex
    }, withOptions), withPlugins);
    eventHandler.emit("reInit");
  }
  function deActivate() {
    engine.dragHandler.removeAllEvents();
    engine.animation.stop();
    engine.eventStore.removeAll();
    engine.translate.clear();
    engine.slideLooper.clear();
    pluginsHandler.destroy();
  }
  function destroy() {
    if (destroyed)
      return;
    destroyed = true;
    resizeHandlers.removeAll();
    deActivate();
    eventHandler.emit("destroy");
  }
  function resize() {
    var newOptions = optionsHandler.atMedia(optionsBase);
    var optionsChanged = !optionsHandler.areEqual(newOptions, options);
    var newRootSize = engine.axis.measureSize(root.getBoundingClientRect());
    var rootSizeChanged = rootSize !== newRootSize;
    var pluginsChanged = pluginsHandler.haveChanged();
    if (rootSizeChanged || optionsChanged || pluginsChanged)
      reActivate();
    eventHandler.emit("resize");
  }
  function slidesInView(target) {
    var location = engine[target ? "target" : "location"].get();
    var type = options.loop ? "removeOffset" : "constrain";
    return engine.slidesInView.check(engine.limit[type](location));
  }
  function slidesNotInView(target) {
    var inView = slidesInView(target);
    return engine.slideIndexes.filter(function(index) {
      return inView.indexOf(index) === -1;
    });
  }
  function scrollTo(index, jump, direction) {
    if (!options.active || destroyed)
      return;
    engine.scrollBody.useBaseMass().useSpeed(jump ? 100 : options.speed);
    engine.scrollTo.index(index, direction || 0);
  }
  function scrollNext(jump) {
    var next = engine.index.clone().add(1);
    scrollTo(next.get(), jump === true, -1);
  }
  function scrollPrev(jump) {
    var prev = engine.index.clone().add(-1);
    scrollTo(prev.get(), jump === true, 1);
  }
  function canScrollNext() {
    var next = engine.index.clone().add(1);
    return next.get() !== selectedScrollSnap();
  }
  function canScrollPrev() {
    var prev = engine.index.clone().add(-1);
    return prev.get() !== selectedScrollSnap();
  }
  function scrollSnapList() {
    return engine.scrollSnaps.map(engine.scrollProgress.get);
  }
  function scrollProgress() {
    return engine.scrollProgress.get(engine.location.get());
  }
  function selectedScrollSnap() {
    return engine.index.get();
  }
  function previousScrollSnap() {
    return engine.indexPrevious.get();
  }
  function clickAllowed() {
    return engine.dragHandler.clickAllowed();
  }
  function plugins() {
    return pluginApis;
  }
  function internalEngine() {
    return engine;
  }
  function rootNode() {
    return root;
  }
  function containerNode() {
    return container;
  }
  function slideNodes() {
    return slides;
  }
  var self2 = {
    canScrollNext,
    canScrollPrev,
    clickAllowed,
    containerNode,
    internalEngine,
    destroy,
    off,
    on,
    plugins,
    previousScrollSnap,
    reInit,
    rootNode,
    scrollNext,
    scrollPrev,
    scrollProgress,
    scrollSnapList,
    scrollTo,
    selectedScrollSnap,
    slideNodes,
    slidesInView,
    slidesNotInView
  };
  activate(userOptions, userPlugins);
  resizeHandlers.add(window, "resize", resize);
  setTimeout(function() {
    return eventHandler.emit("init");
  }, 0);
  return self2;
}
EmblaCarousel.globalOptions = void 0;
EmblaCarousel.optionsHandler = OptionsHandler;
var defaultOptions = {
  active: true,
  breakpoints: {},
  delay: 4e3,
  jump: false,
  playOnInit: true,
  stopOnInteraction: true,
  stopOnMouseEnter: false,
  stopOnLastSnap: false,
  rootNode: null
};
function Autoplay(userOptions) {
  var optionsHandler = EmblaCarousel.optionsHandler();
  var optionsBase = optionsHandler.merge(defaultOptions, Autoplay.globalOptions);
  var options;
  var carousel;
  var interaction;
  var timer = 0;
  var jump = false;
  function init(embla) {
    carousel = embla;
    options = optionsHandler.atMedia(self2.options);
    jump = options.jump;
    interaction = options.stopOnInteraction ? destroy : stop;
    var eventStore = carousel.internalEngine().eventStore;
    var emblaRoot = carousel.rootNode();
    var root = options.rootNode && options.rootNode(emblaRoot) || emblaRoot;
    carousel.on("pointerDown", interaction);
    if (!options.stopOnInteraction)
      carousel.on("pointerUp", reset);
    if (options.stopOnMouseEnter) {
      eventStore.add(root, "mouseenter", interaction);
      if (!options.stopOnInteraction)
        eventStore.add(root, "mouseleave", reset);
    }
    eventStore.add(document, "visibilitychange", function() {
      if (document.visibilityState === "hidden")
        return stop();
      reset();
    });
    eventStore.add(window, "pagehide", function(event) {
      if (event.persisted)
        stop();
    });
    if (options.playOnInit)
      play();
  }
  function destroy() {
    carousel.off("pointerDown", interaction);
    if (!options.stopOnInteraction)
      carousel.off("pointerUp", reset);
    stop();
    timer = 0;
  }
  function play(jumpOverride) {
    stop();
    if (typeof jumpOverride !== "undefined")
      jump = jumpOverride;
    timer = window.setTimeout(next, options.delay);
  }
  function stop() {
    if (!timer)
      return;
    window.clearTimeout(timer);
  }
  function reset() {
    if (!timer)
      return;
    stop();
    play();
  }
  function next() {
    var index = carousel.internalEngine().index;
    var kill = options.stopOnLastSnap && index.get() === index.max;
    if (kill)
      return destroy();
    if (carousel.canScrollNext()) {
      carousel.scrollNext(jump);
    } else {
      carousel.scrollTo(0, jump);
    }
    play();
  }
  var self2 = {
    name: "autoplay",
    options: optionsHandler.merge(optionsBase, userOptions),
    init,
    destroy,
    play,
    stop,
    reset
  };
  return self2;
}
Autoplay.globalOptions = void 0;
const t = (t2) => "object" == typeof t2 && null !== t2 && t2.constructor === Object && "[object Object]" === Object.prototype.toString.call(t2), e = (...i2) => {
  let s2 = false;
  "boolean" == typeof i2[0] && (s2 = i2.shift());
  let o2 = i2[0];
  if (!o2 || "object" != typeof o2)
    throw new Error("extendee must be an object");
  const n2 = i2.slice(1), a2 = n2.length;
  for (let i3 = 0; i3 < a2; i3++) {
    const a3 = n2[i3];
    for (let i4 in a3)
      if (a3.hasOwnProperty(i4)) {
        const n3 = a3[i4];
        if (s2 && (Array.isArray(n3) || t(n3))) {
          const t2 = Array.isArray(n3) ? [] : {};
          o2[i4] = e(true, o2.hasOwnProperty(i4) ? o2[i4] : t2, n3);
        } else
          o2[i4] = n3;
      }
  }
  return o2;
}, i = (t2, e2 = 1e4) => (t2 = parseFloat(t2) || 0, Math.round((t2 + Number.EPSILON) * e2) / e2), s = function(t2) {
  return !!(t2 && "object" == typeof t2 && t2 instanceof Element && t2 !== document.body) && (!t2.__Panzoom && (function(t3) {
    const e2 = getComputedStyle(t3)["overflow-y"], i2 = getComputedStyle(t3)["overflow-x"], s2 = ("scroll" === e2 || "auto" === e2) && Math.abs(t3.scrollHeight - t3.clientHeight) > 1, o2 = ("scroll" === i2 || "auto" === i2) && Math.abs(t3.scrollWidth - t3.clientWidth) > 1;
    return s2 || o2;
  }(t2) ? t2 : s(t2.parentNode)));
}, o = "undefined" != typeof window && window.ResizeObserver || class {
  constructor(t2) {
    this.observables = [], this.boundCheck = this.check.bind(this), this.boundCheck(), this.callback = t2;
  }
  observe(t2) {
    if (this.observables.some((e3) => e3.el === t2))
      return;
    const e2 = { el: t2, size: { height: t2.clientHeight, width: t2.clientWidth } };
    this.observables.push(e2);
  }
  unobserve(t2) {
    this.observables = this.observables.filter((e2) => e2.el !== t2);
  }
  disconnect() {
    this.observables = [];
  }
  check() {
    const t2 = this.observables.filter((t3) => {
      const e2 = t3.el.clientHeight, i2 = t3.el.clientWidth;
      if (t3.size.height !== e2 || t3.size.width !== i2)
        return t3.size.height = e2, t3.size.width = i2, true;
    }).map((t3) => t3.el);
    t2.length > 0 && this.callback(t2), window.requestAnimationFrame(this.boundCheck);
  }
};
class n {
  constructor(t2) {
    this.id = self.Touch && t2 instanceof Touch ? t2.identifier : -1, this.pageX = t2.pageX, this.pageY = t2.pageY, this.clientX = t2.clientX, this.clientY = t2.clientY;
  }
}
const a = (t2, e2) => e2 ? Math.sqrt((e2.clientX - t2.clientX) ** 2 + (e2.clientY - t2.clientY) ** 2) : 0, r = (t2, e2) => e2 ? { clientX: (t2.clientX + e2.clientX) / 2, clientY: (t2.clientY + e2.clientY) / 2 } : t2;
class h {
  constructor(t2, { start: e2 = () => true, move: i2 = () => {
  }, end: s2 = () => {
  } } = {}) {
    this._element = t2, this.startPointers = [], this.currentPointers = [], this._pointerStart = (t3) => {
      if (t3.buttons > 0 && 0 !== t3.button)
        return;
      const e3 = new n(t3);
      this.currentPointers.some((t4) => t4.id === e3.id) || this._triggerPointerStart(e3, t3) && (window.addEventListener("mousemove", this._move), window.addEventListener("mouseup", this._pointerEnd));
    }, this._touchStart = (t3) => {
      for (const e3 of Array.from(t3.changedTouches || []))
        this._triggerPointerStart(new n(e3), t3);
    }, this._move = (t3) => {
      const e3 = this.currentPointers.slice(), i3 = ((t4) => "changedTouches" in t4)(t3) ? Array.from(t3.changedTouches).map((t4) => new n(t4)) : [new n(t3)];
      for (const t4 of i3) {
        const e4 = this.currentPointers.findIndex((e5) => e5.id === t4.id);
        e4 < 0 || (this.currentPointers[e4] = t4);
      }
      this._moveCallback(e3, this.currentPointers.slice(), t3);
    }, this._triggerPointerEnd = (t3, e3) => {
      const i3 = this.currentPointers.findIndex((e4) => e4.id === t3.id);
      return !(i3 < 0) && (this.currentPointers.splice(i3, 1), this.startPointers.splice(i3, 1), this._endCallback(t3, e3), true);
    }, this._pointerEnd = (t3) => {
      t3.buttons > 0 && 0 !== t3.button || this._triggerPointerEnd(new n(t3), t3) && (window.removeEventListener("mousemove", this._move, { passive: false }), window.removeEventListener("mouseup", this._pointerEnd, { passive: false }));
    }, this._touchEnd = (t3) => {
      for (const e3 of Array.from(t3.changedTouches || []))
        this._triggerPointerEnd(new n(e3), t3);
    }, this._startCallback = e2, this._moveCallback = i2, this._endCallback = s2, this._element.addEventListener("mousedown", this._pointerStart, { passive: false }), this._element.addEventListener("touchstart", this._touchStart, { passive: false }), this._element.addEventListener("touchmove", this._move, { passive: false }), this._element.addEventListener("touchend", this._touchEnd), this._element.addEventListener("touchcancel", this._touchEnd);
  }
  stop() {
    this._element.removeEventListener("mousedown", this._pointerStart, { passive: false }), this._element.removeEventListener("touchstart", this._touchStart, { passive: false }), this._element.removeEventListener("touchmove", this._move, { passive: false }), this._element.removeEventListener("touchend", this._touchEnd), this._element.removeEventListener("touchcancel", this._touchEnd), window.removeEventListener("mousemove", this._move), window.removeEventListener("mouseup", this._pointerEnd);
  }
  _triggerPointerStart(t2, e2) {
    return !!this._startCallback(t2, e2) && (this.currentPointers.push(t2), this.startPointers.push(t2), true);
  }
}
class l {
  constructor(t2 = {}) {
    this.options = e(true, {}, t2), this.plugins = [], this.events = {};
    for (const t3 of ["on", "once"])
      for (const e2 of Object.entries(this.options[t3] || {}))
        this[t3](...e2);
  }
  option(t2, e2, ...i2) {
    t2 = String(t2);
    let s2 = (o2 = t2, n2 = this.options, o2.split(".").reduce(function(t3, e3) {
      return t3 && t3[e3];
    }, n2));
    var o2, n2;
    return "function" == typeof s2 && (s2 = s2.call(this, this, ...i2)), void 0 === s2 ? e2 : s2;
  }
  localize(t2, e2 = []) {
    return t2 = (t2 = String(t2).replace(/\{\{(\w+).?(\w+)?\}\}/g, (t3, i2, s2) => {
      let o2 = "";
      s2 ? o2 = this.option(`${i2[0] + i2.toLowerCase().substring(1)}.l10n.${s2}`) : i2 && (o2 = this.option(`l10n.${i2}`)), o2 || (o2 = t3);
      for (let t4 = 0; t4 < e2.length; t4++)
        o2 = o2.split(e2[t4][0]).join(e2[t4][1]);
      return o2;
    })).replace(/\{\{(.*)\}\}/, (t3, e3) => e3);
  }
  on(e2, i2) {
    if (t(e2)) {
      for (const t2 of Object.entries(e2))
        this.on(...t2);
      return this;
    }
    return String(e2).split(" ").forEach((t2) => {
      const e3 = this.events[t2] = this.events[t2] || [];
      -1 == e3.indexOf(i2) && e3.push(i2);
    }), this;
  }
  once(e2, i2) {
    if (t(e2)) {
      for (const t2 of Object.entries(e2))
        this.once(...t2);
      return this;
    }
    return String(e2).split(" ").forEach((t2) => {
      const e3 = (...s2) => {
        this.off(t2, e3), i2.call(this, this, ...s2);
      };
      e3._ = i2, this.on(t2, e3);
    }), this;
  }
  off(e2, i2) {
    if (!t(e2))
      return e2.split(" ").forEach((t2) => {
        const e3 = this.events[t2];
        if (!e3 || !e3.length)
          return this;
        let s2 = -1;
        for (let t3 = 0, o2 = e3.length; t3 < o2; t3++) {
          const o3 = e3[t3];
          if (o3 && (o3 === i2 || o3._ === i2)) {
            s2 = t3;
            break;
          }
        }
        -1 != s2 && e3.splice(s2, 1);
      }), this;
    for (const t2 of Object.entries(e2))
      this.off(...t2);
  }
  trigger(t2, ...e2) {
    for (const i2 of [...this.events[t2] || []].slice())
      if (i2 && false === i2.call(this, this, ...e2))
        return false;
    for (const i2 of [...this.events["*"] || []].slice())
      if (i2 && false === i2.call(this, t2, this, ...e2))
        return false;
    return true;
  }
  attachPlugins(t2) {
    const i2 = {};
    for (const [s2, o2] of Object.entries(t2 || {}))
      false === this.options[s2] || this.plugins[s2] || (this.options[s2] = e({}, o2.defaults || {}, this.options[s2]), i2[s2] = new o2(this));
    for (const [t3, e2] of Object.entries(i2))
      e2.attach(this);
    return this.plugins = Object.assign({}, this.plugins, i2), this;
  }
  detachPlugins() {
    for (const t2 in this.plugins) {
      let e2;
      (e2 = this.plugins[t2]) && "function" == typeof e2.detach && e2.detach(this);
    }
    return this.plugins = {}, this;
  }
}
const c = { touch: true, zoom: true, pinchToZoom: true, panOnlyZoomed: false, lockAxis: false, friction: 0.64, decelFriction: 0.88, zoomFriction: 0.74, bounceForce: 0.2, baseScale: 1, minScale: 1, maxScale: 2, step: 0.5, textSelection: false, click: "toggleZoom", wheel: "zoom", wheelFactor: 42, wheelLimit: 5, draggableClass: "is-draggable", draggingClass: "is-dragging", ratio: 1 };
class d extends l {
  constructor(t2, i2 = {}) {
    super(e(true, {}, c, i2)), this.state = "init", this.$container = t2;
    for (const t3 of ["onLoad", "onWheel", "onClick"])
      this[t3] = this[t3].bind(this);
    this.initLayout(), this.resetValues(), this.attachPlugins(d.Plugins), this.trigger("init"), this.updateMetrics(), this.attachEvents(), this.trigger("ready"), false === this.option("centerOnStart") ? this.state = "ready" : this.panTo({ friction: 0 }), t2.__Panzoom = this;
  }
  initLayout() {
    const t2 = this.$container;
    if (!(t2 instanceof HTMLElement))
      throw new Error("Panzoom: Container not found");
    const e2 = this.option("content") || t2.querySelector(".panzoom__content");
    if (!e2)
      throw new Error("Panzoom: Content not found");
    this.$content = e2;
    let i2 = this.option("viewport") || t2.querySelector(".panzoom__viewport");
    i2 || false === this.option("wrapInner") || (i2 = document.createElement("div"), i2.classList.add("panzoom__viewport"), i2.append(...t2.childNodes), t2.appendChild(i2)), this.$viewport = i2 || e2.parentNode;
  }
  resetValues() {
    this.updateRate = this.option("updateRate", /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 250 : 24), this.container = { width: 0, height: 0 }, this.viewport = { width: 0, height: 0 }, this.content = { origWidth: 0, origHeight: 0, width: 0, height: 0, x: this.option("x", 0), y: this.option("y", 0), scale: this.option("baseScale") }, this.transform = { x: 0, y: 0, scale: 1 }, this.resetDragPosition();
  }
  onLoad(t2) {
    this.updateMetrics(), this.panTo({ scale: this.option("baseScale"), friction: 0 }), this.trigger("load", t2);
  }
  onClick(t2) {
    if (t2.defaultPrevented)
      return;
    if (document.activeElement && document.activeElement.closest("[contenteditable]"))
      return;
    if (this.option("textSelection") && window.getSelection().toString().length && (!t2.target || !t2.target.hasAttribute("data-fancybox-close")))
      return void t2.stopPropagation();
    const e2 = this.$content.getClientRects()[0];
    if ("ready" !== this.state && (this.dragPosition.midPoint || Math.abs(e2.top - this.dragStart.rect.top) > 1 || Math.abs(e2.left - this.dragStart.rect.left) > 1))
      return t2.preventDefault(), void t2.stopPropagation();
    false !== this.trigger("click", t2) && this.option("zoom") && "toggleZoom" === this.option("click") && (t2.preventDefault(), t2.stopPropagation(), this.zoomWithClick(t2));
  }
  onWheel(t2) {
    false !== this.trigger("wheel", t2) && this.option("zoom") && this.option("wheel") && this.zoomWithWheel(t2);
  }
  zoomWithWheel(t2) {
    void 0 === this.changedDelta && (this.changedDelta = 0);
    const e2 = Math.max(-1, Math.min(1, -t2.deltaY || -t2.deltaX || t2.wheelDelta || -t2.detail)), i2 = this.content.scale;
    let s2 = i2 * (100 + e2 * this.option("wheelFactor")) / 100;
    if (e2 < 0 && Math.abs(i2 - this.option("minScale")) < 0.01 || e2 > 0 && Math.abs(i2 - this.option("maxScale")) < 0.01 ? (this.changedDelta += Math.abs(e2), s2 = i2) : (this.changedDelta = 0, s2 = Math.max(Math.min(s2, this.option("maxScale")), this.option("minScale"))), this.changedDelta > this.option("wheelLimit"))
      return;
    if (t2.preventDefault(), s2 === i2)
      return;
    const o2 = this.$content.getBoundingClientRect(), n2 = t2.clientX - o2.left, a2 = t2.clientY - o2.top;
    this.zoomTo(s2, { x: n2, y: a2 });
  }
  zoomWithClick(t2) {
    const e2 = this.$content.getClientRects()[0], i2 = t2.clientX - e2.left, s2 = t2.clientY - e2.top;
    this.toggleZoom({ x: i2, y: s2 });
  }
  attachEvents() {
    this.$content.addEventListener("load", this.onLoad), this.$container.addEventListener("wheel", this.onWheel, { passive: false }), this.$container.addEventListener("click", this.onClick, { passive: false }), this.initObserver();
    const t2 = new h(this.$container, { start: (e2, i2) => {
      if (!this.option("touch"))
        return false;
      if (this.velocity.scale < 0)
        return false;
      const o2 = i2.composedPath()[0];
      if (!t2.currentPointers.length) {
        if (-1 !== ["BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(o2.nodeName))
          return false;
        if (this.option("textSelection") && ((t3, e3, i3) => {
          const s2 = t3.childNodes, o3 = document.createRange();
          for (let t4 = 0; t4 < s2.length; t4++) {
            const n2 = s2[t4];
            if (n2.nodeType !== Node.TEXT_NODE)
              continue;
            o3.selectNodeContents(n2);
            const a2 = o3.getBoundingClientRect();
            if (e3 >= a2.left && i3 >= a2.top && e3 <= a2.right && i3 <= a2.bottom)
              return n2;
          }
          return false;
        })(o2, e2.clientX, e2.clientY))
          return false;
      }
      return !s(o2) && (false !== this.trigger("touchStart", i2) && ("mousedown" === i2.type && i2.preventDefault(), this.state = "pointerdown", this.resetDragPosition(), this.dragPosition.midPoint = null, this.dragPosition.time = Date.now(), true));
    }, move: (e2, i2, s2) => {
      if ("pointerdown" !== this.state)
        return;
      if (false === this.trigger("touchMove", s2))
        return void s2.preventDefault();
      if (i2.length < 2 && true === this.option("panOnlyZoomed") && this.content.width <= this.viewport.width && this.content.height <= this.viewport.height && this.transform.scale <= this.option("baseScale"))
        return;
      if (i2.length > 1 && (!this.option("zoom") || false === this.option("pinchToZoom")))
        return;
      const o2 = r(e2[0], e2[1]), n2 = r(i2[0], i2[1]), h2 = n2.clientX - o2.clientX, l2 = n2.clientY - o2.clientY, c2 = a(e2[0], e2[1]), d2 = a(i2[0], i2[1]), u2 = c2 && d2 ? d2 / c2 : 1;
      this.dragOffset.x += h2, this.dragOffset.y += l2, this.dragOffset.scale *= u2, this.dragOffset.time = Date.now() - this.dragPosition.time;
      const f2 = 1 === this.dragStart.scale && this.option("lockAxis");
      if (f2 && !this.lockAxis) {
        if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6)
          return void s2.preventDefault();
        const t3 = Math.abs(180 * Math.atan2(this.dragOffset.y, this.dragOffset.x) / Math.PI);
        this.lockAxis = t3 > 45 && t3 < 135 ? "y" : "x";
      }
      if ("xy" === f2 || "y" !== this.lockAxis) {
        if (s2.preventDefault(), s2.stopPropagation(), s2.stopImmediatePropagation(), this.lockAxis && (this.dragOffset["x" === this.lockAxis ? "y" : "x"] = 0), this.$container.classList.add(this.option("draggingClass")), this.transform.scale === this.option("baseScale") && "y" === this.lockAxis || (this.dragPosition.x = this.dragStart.x + this.dragOffset.x), this.transform.scale === this.option("baseScale") && "x" === this.lockAxis || (this.dragPosition.y = this.dragStart.y + this.dragOffset.y), this.dragPosition.scale = this.dragStart.scale * this.dragOffset.scale, i2.length > 1) {
          const e3 = r(t2.startPointers[0], t2.startPointers[1]), i3 = e3.clientX - this.dragStart.rect.x, s3 = e3.clientY - this.dragStart.rect.y, { deltaX: o3, deltaY: a2 } = this.getZoomDelta(this.content.scale * this.dragOffset.scale, i3, s3);
          this.dragPosition.x -= o3, this.dragPosition.y -= a2, this.dragPosition.midPoint = n2;
        } else
          this.setDragResistance();
        this.transform = { x: this.dragPosition.x, y: this.dragPosition.y, scale: this.dragPosition.scale }, this.startAnimation();
      }
    }, end: (e2, i2) => {
      if ("pointerdown" !== this.state)
        return;
      if (this._dragOffset = { ...this.dragOffset }, t2.currentPointers.length)
        return void this.resetDragPosition();
      if (this.state = "decel", this.friction = this.option("decelFriction"), this.recalculateTransform(), this.$container.classList.remove(this.option("draggingClass")), false === this.trigger("touchEnd", i2))
        return;
      if ("decel" !== this.state)
        return;
      const s2 = this.option("minScale");
      if (this.transform.scale < s2)
        return void this.zoomTo(s2, { friction: 0.64 });
      const o2 = this.option("maxScale");
      if (this.transform.scale - o2 > 0.01) {
        const t3 = this.dragPosition.midPoint || e2, i3 = this.$content.getClientRects()[0];
        this.zoomTo(o2, { friction: 0.64, x: t3.clientX - i3.left, y: t3.clientY - i3.top });
      }
    } });
    this.pointerTracker = t2;
  }
  initObserver() {
    this.resizeObserver || (this.resizeObserver = new o(() => {
      this.updateTimer || (this.updateTimer = setTimeout(() => {
        const t2 = this.$container.getBoundingClientRect();
        t2.width && t2.height ? ((Math.abs(t2.width - this.container.width) > 1 || Math.abs(t2.height - this.container.height) > 1) && (this.isAnimating() && this.endAnimation(true), this.updateMetrics(), this.panTo({ x: this.content.x, y: this.content.y, scale: this.option("baseScale"), friction: 0 })), this.updateTimer = null) : this.updateTimer = null;
      }, this.updateRate));
    }), this.resizeObserver.observe(this.$container));
  }
  resetDragPosition() {
    this.lockAxis = null, this.friction = this.option("friction"), this.velocity = { x: 0, y: 0, scale: 0 };
    const { x: t2, y: e2, scale: i2 } = this.content;
    this.dragStart = { rect: this.$content.getBoundingClientRect(), x: t2, y: e2, scale: i2 }, this.dragPosition = { ...this.dragPosition, x: t2, y: e2, scale: i2 }, this.dragOffset = { x: 0, y: 0, scale: 1, time: 0 };
  }
  updateMetrics(t2) {
    true !== t2 && this.trigger("beforeUpdate");
    const e2 = this.$container, s2 = this.$content, o2 = this.$viewport, n2 = s2 instanceof HTMLImageElement, a2 = this.option("zoom"), r2 = this.option("resizeParent", a2);
    let h2 = this.option("width"), l2 = this.option("height"), c2 = h2 || (d2 = s2, Math.max(parseFloat(d2.naturalWidth || 0), parseFloat(d2.width && d2.width.baseVal && d2.width.baseVal.value || 0), parseFloat(d2.offsetWidth || 0), parseFloat(d2.scrollWidth || 0)));
    var d2;
    let u2 = l2 || ((t3) => Math.max(parseFloat(t3.naturalHeight || 0), parseFloat(t3.height && t3.height.baseVal && t3.height.baseVal.value || 0), parseFloat(t3.offsetHeight || 0), parseFloat(t3.scrollHeight || 0)))(s2);
    Object.assign(s2.style, { width: h2 ? `${h2}px` : "", height: l2 ? `${l2}px` : "", maxWidth: "", maxHeight: "" }), r2 && Object.assign(o2.style, { width: "", height: "" });
    const f2 = this.option("ratio");
    c2 = i(c2 * f2), u2 = i(u2 * f2), h2 = c2, l2 = u2;
    const g2 = s2.getBoundingClientRect(), p2 = o2.getBoundingClientRect(), m2 = o2 == e2 ? p2 : e2.getBoundingClientRect();
    let y2 = Math.max(o2.offsetWidth, i(p2.width)), v2 = Math.max(o2.offsetHeight, i(p2.height)), b2 = window.getComputedStyle(o2);
    if (y2 -= parseFloat(b2.paddingLeft) + parseFloat(b2.paddingRight), v2 -= parseFloat(b2.paddingTop) + parseFloat(b2.paddingBottom), this.viewport.width = y2, this.viewport.height = v2, a2) {
      if (Math.abs(c2 - g2.width) > 0.1 || Math.abs(u2 - g2.height) > 0.1) {
        const t3 = ((t4, e3, i2, s3) => {
          const o3 = Math.min(i2 / t4 || 0, s3 / e3);
          return { width: t4 * o3 || 0, height: e3 * o3 || 0 };
        })(c2, u2, Math.min(c2, g2.width), Math.min(u2, g2.height));
        h2 = i(t3.width), l2 = i(t3.height);
      }
      Object.assign(s2.style, { width: `${h2}px`, height: `${l2}px`, transform: "" });
    }
    if (r2 && (Object.assign(o2.style, { width: `${h2}px`, height: `${l2}px` }), this.viewport = { ...this.viewport, width: h2, height: l2 }), n2 && a2 && "function" != typeof this.options.maxScale) {
      const t3 = this.option("maxScale");
      this.options.maxScale = function() {
        return this.content.origWidth > 0 && this.content.fitWidth > 0 ? this.content.origWidth / this.content.fitWidth : t3;
      };
    }
    this.content = { ...this.content, origWidth: c2, origHeight: u2, fitWidth: h2, fitHeight: l2, width: h2, height: l2, scale: 1, isZoomable: a2 }, this.container = { width: m2.width, height: m2.height }, true !== t2 && this.trigger("afterUpdate");
  }
  zoomIn(t2) {
    this.zoomTo(this.content.scale + (t2 || this.option("step")));
  }
  zoomOut(t2) {
    this.zoomTo(this.content.scale - (t2 || this.option("step")));
  }
  toggleZoom(t2 = {}) {
    const e2 = this.option("maxScale"), i2 = this.option("baseScale"), s2 = this.content.scale > i2 + 0.5 * (e2 - i2) ? i2 : e2;
    this.zoomTo(s2, t2);
  }
  zoomTo(t2 = this.option("baseScale"), { x: e2 = null, y: s2 = null } = {}) {
    t2 = Math.max(Math.min(t2, this.option("maxScale")), this.option("minScale"));
    const o2 = i(this.content.scale / (this.content.width / this.content.fitWidth), 1e7);
    null === e2 && (e2 = this.content.width * o2 * 0.5), null === s2 && (s2 = this.content.height * o2 * 0.5);
    const { deltaX: n2, deltaY: a2 } = this.getZoomDelta(t2, e2, s2);
    e2 = this.content.x - n2, s2 = this.content.y - a2, this.panTo({ x: e2, y: s2, scale: t2, friction: this.option("zoomFriction") });
  }
  getZoomDelta(t2, e2 = 0, i2 = 0) {
    const s2 = this.content.fitWidth * this.content.scale, o2 = this.content.fitHeight * this.content.scale, n2 = e2 > 0 && s2 ? e2 / s2 : 0, a2 = i2 > 0 && o2 ? i2 / o2 : 0;
    return { deltaX: (this.content.fitWidth * t2 - s2) * n2, deltaY: (this.content.fitHeight * t2 - o2) * a2 };
  }
  panTo({ x: t2 = this.content.x, y: e2 = this.content.y, scale: i2, friction: s2 = this.option("friction"), ignoreBounds: o2 = false } = {}) {
    if (i2 = i2 || this.content.scale || 1, !o2) {
      const { boundX: s3, boundY: o3 } = this.getBounds(i2);
      s3 && (t2 = Math.max(Math.min(t2, s3.to), s3.from)), o3 && (e2 = Math.max(Math.min(e2, o3.to), o3.from));
    }
    this.friction = s2, this.transform = { ...this.transform, x: t2, y: e2, scale: i2 }, s2 ? (this.state = "panning", this.velocity = { x: (1 / this.friction - 1) * (t2 - this.content.x), y: (1 / this.friction - 1) * (e2 - this.content.y), scale: (1 / this.friction - 1) * (i2 - this.content.scale) }, this.startAnimation()) : this.endAnimation();
  }
  startAnimation() {
    this.rAF ? cancelAnimationFrame(this.rAF) : this.trigger("startAnimation"), this.rAF = requestAnimationFrame(() => this.animate());
  }
  animate() {
    if (this.setEdgeForce(), this.setDragForce(), this.velocity.x *= this.friction, this.velocity.y *= this.friction, this.velocity.scale *= this.friction, this.content.x += this.velocity.x, this.content.y += this.velocity.y, this.content.scale += this.velocity.scale, this.isAnimating())
      this.setTransform();
    else if ("pointerdown" !== this.state)
      return void this.endAnimation();
    this.rAF = requestAnimationFrame(() => this.animate());
  }
  getBounds(t2) {
    let e2 = this.boundX, s2 = this.boundY;
    if (void 0 !== e2 && void 0 !== s2)
      return { boundX: e2, boundY: s2 };
    e2 = { from: 0, to: 0 }, s2 = { from: 0, to: 0 }, t2 = t2 || this.transform.scale;
    const o2 = this.content.fitWidth * t2, n2 = this.content.fitHeight * t2, a2 = this.viewport.width, r2 = this.viewport.height;
    if (o2 < a2) {
      const t3 = i(0.5 * (a2 - o2));
      e2.from = t3, e2.to = t3;
    } else
      e2.from = i(a2 - o2);
    if (n2 < r2) {
      const t3 = 0.5 * (r2 - n2);
      s2.from = t3, s2.to = t3;
    } else
      s2.from = i(r2 - n2);
    return { boundX: e2, boundY: s2 };
  }
  setEdgeForce() {
    if ("decel" !== this.state)
      return;
    const t2 = this.option("bounceForce"), { boundX: e2, boundY: i2 } = this.getBounds(Math.max(this.transform.scale, this.content.scale));
    let s2, o2, n2, a2;
    if (e2 && (s2 = this.content.x < e2.from, o2 = this.content.x > e2.to), i2 && (n2 = this.content.y < i2.from, a2 = this.content.y > i2.to), s2 || o2) {
      let i3 = ((s2 ? e2.from : e2.to) - this.content.x) * t2;
      const o3 = this.content.x + (this.velocity.x + i3) / this.friction;
      o3 >= e2.from && o3 <= e2.to && (i3 += this.velocity.x), this.velocity.x = i3, this.recalculateTransform();
    }
    if (n2 || a2) {
      let e3 = ((n2 ? i2.from : i2.to) - this.content.y) * t2;
      const s3 = this.content.y + (e3 + this.velocity.y) / this.friction;
      s3 >= i2.from && s3 <= i2.to && (e3 += this.velocity.y), this.velocity.y = e3, this.recalculateTransform();
    }
  }
  setDragResistance() {
    if ("pointerdown" !== this.state)
      return;
    const { boundX: t2, boundY: e2 } = this.getBounds(this.dragPosition.scale);
    let i2, s2, o2, n2;
    if (t2 && (i2 = this.dragPosition.x < t2.from, s2 = this.dragPosition.x > t2.to), e2 && (o2 = this.dragPosition.y < e2.from, n2 = this.dragPosition.y > e2.to), (i2 || s2) && (!i2 || !s2)) {
      const e3 = i2 ? t2.from : t2.to, s3 = e3 - this.dragPosition.x;
      this.dragPosition.x = e3 - 0.3 * s3;
    }
    if ((o2 || n2) && (!o2 || !n2)) {
      const t3 = o2 ? e2.from : e2.to, i3 = t3 - this.dragPosition.y;
      this.dragPosition.y = t3 - 0.3 * i3;
    }
  }
  setDragForce() {
    "pointerdown" === this.state && (this.velocity.x = this.dragPosition.x - this.content.x, this.velocity.y = this.dragPosition.y - this.content.y, this.velocity.scale = this.dragPosition.scale - this.content.scale);
  }
  recalculateTransform() {
    this.transform.x = this.content.x + this.velocity.x / (1 / this.friction - 1), this.transform.y = this.content.y + this.velocity.y / (1 / this.friction - 1), this.transform.scale = this.content.scale + this.velocity.scale / (1 / this.friction - 1);
  }
  isAnimating() {
    return !(!this.friction || !(Math.abs(this.velocity.x) > 0.05 || Math.abs(this.velocity.y) > 0.05 || Math.abs(this.velocity.scale) > 0.05));
  }
  setTransform(t2) {
    let e2, s2, o2;
    if (t2 ? (e2 = i(this.transform.x), s2 = i(this.transform.y), o2 = this.transform.scale, this.content = { ...this.content, x: e2, y: s2, scale: o2 }) : (e2 = i(this.content.x), s2 = i(this.content.y), o2 = this.content.scale / (this.content.width / this.content.fitWidth), this.content = { ...this.content, x: e2, y: s2 }), this.trigger("beforeTransform"), e2 = i(this.content.x), s2 = i(this.content.y), t2 && this.option("zoom")) {
      let t3, n2;
      t3 = i(this.content.fitWidth * o2), n2 = i(this.content.fitHeight * o2), this.content.width = t3, this.content.height = n2, this.transform = { ...this.transform, width: t3, height: n2, scale: o2 }, Object.assign(this.$content.style, { width: `${t3}px`, height: `${n2}px`, maxWidth: "none", maxHeight: "none", transform: `translate3d(${e2}px, ${s2}px, 0) scale(1)` });
    } else
      this.$content.style.transform = `translate3d(${e2}px, ${s2}px, 0) scale(${o2})`;
    this.trigger("afterTransform");
  }
  endAnimation(t2) {
    cancelAnimationFrame(this.rAF), this.rAF = null, this.velocity = { x: 0, y: 0, scale: 0 }, this.setTransform(true), this.state = "ready", this.handleCursor(), true !== t2 && this.trigger("endAnimation");
  }
  handleCursor() {
    const t2 = this.option("draggableClass");
    t2 && this.option("touch") && (1 == this.option("panOnlyZoomed") && this.content.width <= this.viewport.width && this.content.height <= this.viewport.height && this.transform.scale <= this.option("baseScale") ? this.$container.classList.remove(t2) : this.$container.classList.add(t2));
  }
  detachEvents() {
    this.$content.removeEventListener("load", this.onLoad), this.$container.removeEventListener("wheel", this.onWheel, { passive: false }), this.$container.removeEventListener("click", this.onClick, { passive: false }), this.pointerTracker && (this.pointerTracker.stop(), this.pointerTracker = null), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null);
  }
  destroy() {
    "destroy" !== this.state && (this.state = "destroy", clearTimeout(this.updateTimer), this.updateTimer = null, cancelAnimationFrame(this.rAF), this.rAF = null, this.detachEvents(), this.detachPlugins(), this.resetDragPosition());
  }
}
d.version = "4.0.31", d.Plugins = {};
const u = (t2, e2) => {
  let i2 = 0;
  return function(...s2) {
    const o2 = new Date().getTime();
    if (!(o2 - i2 < e2))
      return i2 = o2, t2(...s2);
  };
};
class f {
  constructor(t2) {
    this.$container = null, this.$prev = null, this.$next = null, this.carousel = t2, this.onRefresh = this.onRefresh.bind(this);
  }
  option(t2) {
    return this.carousel.option(`Navigation.${t2}`);
  }
  createButton(t2) {
    const e2 = document.createElement("button");
    e2.setAttribute("title", this.carousel.localize(`{{${t2.toUpperCase()}}}`));
    const i2 = this.option("classNames.button") + " " + this.option(`classNames.${t2}`);
    return e2.classList.add(...i2.split(" ")), e2.setAttribute("tabindex", "0"), e2.innerHTML = this.carousel.localize(this.option(`${t2}Tpl`)), e2.addEventListener("click", (e3) => {
      e3.preventDefault(), e3.stopPropagation(), this.carousel["slide" + ("next" === t2 ? "Next" : "Prev")]();
    }), e2;
  }
  build() {
    this.$container || (this.$container = document.createElement("div"), this.$container.classList.add(...this.option("classNames.main").split(" ")), this.carousel.$container.appendChild(this.$container)), this.$next || (this.$next = this.createButton("next"), this.$container.appendChild(this.$next)), this.$prev || (this.$prev = this.createButton("prev"), this.$container.appendChild(this.$prev));
  }
  onRefresh() {
    const t2 = this.carousel.pages.length;
    t2 <= 1 || t2 > 1 && this.carousel.elemDimWidth < this.carousel.wrapDimWidth && !Number.isInteger(this.carousel.option("slidesPerPage")) ? this.cleanup() : (this.build(), this.$prev.removeAttribute("disabled"), this.$next.removeAttribute("disabled"), this.carousel.option("infiniteX", this.carousel.option("infinite")) || (this.carousel.page <= 0 && this.$prev.setAttribute("disabled", ""), this.carousel.page >= t2 - 1 && this.$next.setAttribute("disabled", "")));
  }
  cleanup() {
    this.$prev && this.$prev.remove(), this.$prev = null, this.$next && this.$next.remove(), this.$next = null, this.$container && this.$container.remove(), this.$container = null;
  }
  attach() {
    this.carousel.on("refresh change", this.onRefresh);
  }
  detach() {
    this.carousel.off("refresh change", this.onRefresh), this.cleanup();
  }
}
f.defaults = { prevTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>', nextTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>', classNames: { main: "carousel__nav", button: "carousel__button", next: "is-next", prev: "is-prev" } };
class g {
  constructor(t2) {
    this.carousel = t2, this.selectedIndex = null, this.friction = 0, this.onNavReady = this.onNavReady.bind(this), this.onNavClick = this.onNavClick.bind(this), this.onNavCreateSlide = this.onNavCreateSlide.bind(this), this.onTargetChange = this.onTargetChange.bind(this);
  }
  addAsTargetFor(t2) {
    this.target = this.carousel, this.nav = t2, this.attachEvents();
  }
  addAsNavFor(t2) {
    this.target = t2, this.nav = this.carousel, this.attachEvents();
  }
  attachEvents() {
    this.nav.options.initialSlide = this.target.options.initialPage, this.nav.on("ready", this.onNavReady), this.nav.on("createSlide", this.onNavCreateSlide), this.nav.on("Panzoom.click", this.onNavClick), this.target.on("change", this.onTargetChange), this.target.on("Panzoom.afterUpdate", this.onTargetChange);
  }
  onNavReady() {
    this.onTargetChange(true);
  }
  onNavClick(t2, e2, i2) {
    const s2 = i2.target.closest(".carousel__slide");
    if (!s2)
      return;
    i2.stopPropagation();
    const o2 = parseInt(s2.dataset.index, 10), n2 = this.target.findPageForSlide(o2);
    this.target.page !== n2 && this.target.slideTo(n2, { friction: this.friction }), this.markSelectedSlide(o2);
  }
  onNavCreateSlide(t2, e2) {
    e2.index === this.selectedIndex && this.markSelectedSlide(e2.index);
  }
  onTargetChange() {
    const t2 = this.target.pages[this.target.page].indexes[0], e2 = this.nav.findPageForSlide(t2);
    this.nav.slideTo(e2), this.markSelectedSlide(t2);
  }
  markSelectedSlide(t2) {
    this.selectedIndex = t2, [...this.nav.slides].filter((t3) => t3.$el && t3.$el.classList.remove("is-nav-selected"));
    const e2 = this.nav.slides[t2];
    e2 && e2.$el && e2.$el.classList.add("is-nav-selected");
  }
  attach(t2) {
    const e2 = t2.options.Sync;
    (e2.target || e2.nav) && (e2.target ? this.addAsNavFor(e2.target) : e2.nav && this.addAsTargetFor(e2.nav), this.friction = e2.friction);
  }
  detach() {
    this.nav && (this.nav.off("ready", this.onNavReady), this.nav.off("Panzoom.click", this.onNavClick), this.nav.off("createSlide", this.onNavCreateSlide)), this.target && (this.target.off("Panzoom.afterUpdate", this.onTargetChange), this.target.off("change", this.onTargetChange));
  }
}
g.defaults = { friction: 0.92 };
const p = { Navigation: f, Dots: class {
  constructor(t2) {
    this.carousel = t2, this.$list = null, this.events = { change: this.onChange.bind(this), refresh: this.onRefresh.bind(this) };
  }
  buildList() {
    if (this.carousel.pages.length < this.carousel.option("Dots.minSlideCount"))
      return;
    const t2 = document.createElement("ol");
    return t2.classList.add("carousel__dots"), t2.addEventListener("click", (t3) => {
      if (!("page" in t3.target.dataset))
        return;
      t3.preventDefault(), t3.stopPropagation();
      const e2 = parseInt(t3.target.dataset.page, 10), i2 = this.carousel;
      e2 !== i2.page && (i2.pages.length < 3 && i2.option("infinite") ? i2[0 == e2 ? "slidePrev" : "slideNext"]() : i2.slideTo(e2));
    }), this.$list = t2, this.carousel.$container.appendChild(t2), this.carousel.$container.classList.add("has-dots"), t2;
  }
  removeList() {
    this.$list && (this.$list.parentNode.removeChild(this.$list), this.$list = null), this.carousel.$container.classList.remove("has-dots");
  }
  rebuildDots() {
    let t2 = this.$list;
    const e2 = !!t2, i2 = this.carousel.pages.length;
    if (i2 < 2)
      return void (e2 && this.removeList());
    e2 || (t2 = this.buildList());
    const s2 = this.$list.children.length;
    if (s2 > i2)
      for (let t3 = i2; t3 < s2; t3++)
        this.$list.removeChild(this.$list.lastChild);
    else {
      for (let t3 = s2; t3 < i2; t3++) {
        const e3 = document.createElement("li");
        e3.classList.add("carousel__dot"), e3.dataset.page = t3, e3.setAttribute("role", "button"), e3.setAttribute("tabindex", "0"), e3.setAttribute("title", this.carousel.localize("{{GOTO}}", [["%d", t3 + 1]])), e3.addEventListener("keydown", (t4) => {
          const i3 = t4.code;
          let s3;
          "Enter" === i3 || "NumpadEnter" === i3 ? s3 = e3 : "ArrowRight" === i3 ? s3 = e3.nextSibling : "ArrowLeft" === i3 && (s3 = e3.previousSibling), s3 && s3.click();
        }), this.$list.appendChild(e3);
      }
      this.setActiveDot();
    }
  }
  setActiveDot() {
    if (!this.$list)
      return;
    this.$list.childNodes.forEach((t3) => {
      t3.classList.remove("is-selected");
    });
    const t2 = this.$list.childNodes[this.carousel.page];
    t2 && t2.classList.add("is-selected");
  }
  onChange() {
    this.setActiveDot();
  }
  onRefresh() {
    this.rebuildDots();
  }
  attach() {
    this.carousel.on(this.events);
  }
  detach() {
    this.removeList(), this.carousel.off(this.events), this.carousel = null;
  }
}, Sync: g };
const m = { slides: [], preload: 0, slidesPerPage: "auto", initialPage: null, initialSlide: null, friction: 0.92, center: true, infinite: true, fill: true, dragFree: false, prefix: "", classNames: { viewport: "carousel__viewport", track: "carousel__track", slide: "carousel__slide", slideSelected: "is-selected" }, l10n: { NEXT: "Next slide", PREV: "Previous slide", GOTO: "Go to slide #%d" } };
class y extends l {
  constructor(t2, i2 = {}) {
    if (super(i2 = e(true, {}, m, i2)), this.state = "init", this.$container = t2, !(this.$container instanceof HTMLElement))
      throw new Error("No root element provided");
    this.slideNext = u(this.slideNext.bind(this), 250), this.slidePrev = u(this.slidePrev.bind(this), 250), this.init(), t2.__Carousel = this;
  }
  init() {
    this.pages = [], this.page = this.pageIndex = null, this.prevPage = this.prevPageIndex = null, this.attachPlugins(y.Plugins), this.trigger("init"), this.initLayout(), this.initSlides(), this.updateMetrics(), this.$track && this.pages.length && (this.$track.style.transform = `translate3d(${-1 * this.pages[this.page].left}px, 0px, 0) scale(1)`), this.manageSlideVisiblity(), this.initPanzoom(), this.state = "ready", this.trigger("ready");
  }
  initLayout() {
    const t2 = this.option("prefix"), e2 = this.option("classNames");
    this.$viewport = this.option("viewport") || this.$container.querySelector(`.${t2}${e2.viewport}`), this.$viewport || (this.$viewport = document.createElement("div"), this.$viewport.classList.add(...(t2 + e2.viewport).split(" ")), this.$viewport.append(...this.$container.childNodes), this.$container.appendChild(this.$viewport)), this.$track = this.option("track") || this.$container.querySelector(`.${t2}${e2.track}`), this.$track || (this.$track = document.createElement("div"), this.$track.classList.add(...(t2 + e2.track).split(" ")), this.$track.append(...this.$viewport.childNodes), this.$viewport.appendChild(this.$track));
  }
  initSlides() {
    this.slides = [];
    this.$viewport.querySelectorAll(`.${this.option("prefix")}${this.option("classNames.slide")}`).forEach((t2) => {
      const e2 = { $el: t2, isDom: true };
      this.slides.push(e2), this.trigger("createSlide", e2, this.slides.length);
    }), Array.isArray(this.options.slides) && (this.slides = e(true, [...this.slides], this.options.slides));
  }
  updateMetrics() {
    let t2, e2 = 0, s2 = [];
    this.slides.forEach((i2, o3) => {
      const n3 = i2.$el, a3 = i2.isDom || !t2 ? this.getSlideMetrics(n3) : t2;
      i2.index = o3, i2.width = a3, i2.left = e2, t2 = a3, e2 += a3, s2.push(o3);
    });
    let o2 = Math.max(this.$track.offsetWidth, i(this.$track.getBoundingClientRect().width)), n2 = getComputedStyle(this.$track);
    o2 -= parseFloat(n2.paddingLeft) + parseFloat(n2.paddingRight), this.contentWidth = e2, this.viewportWidth = o2;
    const a2 = [], r2 = this.option("slidesPerPage");
    if (Number.isInteger(r2) && e2 > o2)
      for (let t3 = 0; t3 < this.slides.length; t3 += r2)
        a2.push({ indexes: s2.slice(t3, t3 + r2), slides: this.slides.slice(t3, t3 + r2) });
    else {
      let t3 = 0, e3 = 0;
      for (let i2 = 0; i2 < this.slides.length; i2 += 1) {
        let s3 = this.slides[i2];
        (!a2.length || e3 + s3.width > o2) && (a2.push({ indexes: [], slides: [] }), t3 = a2.length - 1, e3 = 0), e3 += s3.width, a2[t3].indexes.push(i2), a2[t3].slides.push(s3);
      }
    }
    const h2 = this.option("center"), l2 = this.option("fill");
    a2.forEach((t3, i2) => {
      t3.index = i2, t3.width = t3.slides.reduce((t4, e3) => t4 + e3.width, 0), t3.left = t3.slides[0].left, h2 && (t3.left += 0.5 * (o2 - t3.width) * -1), l2 && !this.option("infiniteX", this.option("infinite")) && e2 > o2 && (t3.left = Math.max(t3.left, 0), t3.left = Math.min(t3.left, e2 - o2));
    });
    const c2 = [];
    let d2;
    a2.forEach((t3) => {
      const e3 = { ...t3 };
      d2 && e3.left === d2.left ? (d2.width += e3.width, d2.slides = [...d2.slides, ...e3.slides], d2.indexes = [...d2.indexes, ...e3.indexes]) : (e3.index = c2.length, d2 = e3, c2.push(e3));
    }), this.pages = c2;
    let u2 = this.page;
    if (null === u2) {
      const t3 = this.option("initialSlide");
      u2 = null !== t3 ? this.findPageForSlide(t3) : parseInt(this.option("initialPage", 0), 10) || 0, c2[u2] || (u2 = c2.length && u2 > c2.length ? c2[c2.length - 1].index : 0), this.page = u2, this.pageIndex = u2;
    }
    this.updatePanzoom(), this.trigger("refresh");
  }
  getSlideMetrics(t2) {
    if (!t2) {
      const e3 = this.slides[0];
      (t2 = document.createElement("div")).dataset.isTestEl = 1, t2.style.visibility = "hidden", t2.classList.add(...(this.option("prefix") + this.option("classNames.slide")).split(" ")), e3.customClass && t2.classList.add(...e3.customClass.split(" ")), this.$track.prepend(t2);
    }
    let e2 = Math.max(t2.offsetWidth, i(t2.getBoundingClientRect().width));
    const s2 = t2.currentStyle || window.getComputedStyle(t2);
    return e2 = e2 + (parseFloat(s2.marginLeft) || 0) + (parseFloat(s2.marginRight) || 0), t2.dataset.isTestEl && t2.remove(), e2;
  }
  findPageForSlide(t2) {
    t2 = parseInt(t2, 10) || 0;
    const e2 = this.pages.find((e3) => e3.indexes.indexOf(t2) > -1);
    return e2 ? e2.index : null;
  }
  slideNext() {
    this.slideTo(this.pageIndex + 1);
  }
  slidePrev() {
    this.slideTo(this.pageIndex - 1);
  }
  slideTo(t2, e2 = {}) {
    const { x: i2 = -1 * this.setPage(t2, true), y: s2 = 0, friction: o2 = this.option("friction") } = e2;
    this.Panzoom.content.x === i2 && !this.Panzoom.velocity.x && o2 || (this.Panzoom.panTo({ x: i2, y: s2, friction: o2, ignoreBounds: true }), "ready" === this.state && "ready" === this.Panzoom.state && this.trigger("settle"));
  }
  initPanzoom() {
    this.Panzoom && this.Panzoom.destroy();
    const t2 = e(true, {}, { content: this.$track, wrapInner: false, resizeParent: false, zoom: false, click: false, lockAxis: "x", x: this.pages.length ? -1 * this.pages[this.page].left : 0, centerOnStart: false, textSelection: () => this.option("textSelection", false), panOnlyZoomed: function() {
      return this.content.width <= this.viewport.width;
    } }, this.option("Panzoom"));
    this.Panzoom = new d(this.$container, t2), this.Panzoom.on({ "*": (t3, ...e2) => this.trigger(`Panzoom.${t3}`, ...e2), afterUpdate: () => {
      this.updatePage();
    }, beforeTransform: this.onBeforeTransform.bind(this), touchEnd: this.onTouchEnd.bind(this), endAnimation: () => {
      this.trigger("settle");
    } }), this.updateMetrics(), this.manageSlideVisiblity();
  }
  updatePanzoom() {
    this.Panzoom && (this.Panzoom.content = { ...this.Panzoom.content, fitWidth: this.contentWidth, origWidth: this.contentWidth, width: this.contentWidth }, this.pages.length > 1 && this.option("infiniteX", this.option("infinite")) ? this.Panzoom.boundX = null : this.pages.length && (this.Panzoom.boundX = { from: -1 * this.pages[this.pages.length - 1].left, to: -1 * this.pages[0].left }), this.option("infiniteY", this.option("infinite")) ? this.Panzoom.boundY = null : this.Panzoom.boundY = { from: 0, to: 0 }, this.Panzoom.handleCursor());
  }
  manageSlideVisiblity() {
    const t2 = this.contentWidth, e2 = this.viewportWidth;
    let i2 = this.Panzoom ? -1 * this.Panzoom.content.x : this.pages.length ? this.pages[this.page].left : 0;
    const s2 = this.option("preload"), o2 = this.option("infiniteX", this.option("infinite")), n2 = parseFloat(getComputedStyle(this.$viewport, null).getPropertyValue("padding-left")), a2 = parseFloat(getComputedStyle(this.$viewport, null).getPropertyValue("padding-right"));
    this.slides.forEach((r3) => {
      let h3, l2, c2 = 0;
      h3 = i2 - n2, l2 = i2 + e2 + a2, h3 -= s2 * (e2 + n2 + a2), l2 += s2 * (e2 + n2 + a2);
      const d2 = r3.left + r3.width > h3 && r3.left < l2;
      h3 = i2 + t2 - n2, l2 = i2 + t2 + e2 + a2, h3 -= s2 * (e2 + n2 + a2);
      const u2 = o2 && r3.left + r3.width > h3 && r3.left < l2;
      h3 = i2 - t2 - n2, l2 = i2 - t2 + e2 + a2, h3 -= s2 * (e2 + n2 + a2);
      const f2 = o2 && r3.left + r3.width > h3 && r3.left < l2;
      u2 || d2 || f2 ? (this.createSlideEl(r3), d2 && (c2 = 0), u2 && (c2 = -1), f2 && (c2 = 1), r3.left + r3.width > i2 && r3.left <= i2 + e2 + a2 && (c2 = 0)) : this.removeSlideEl(r3), r3.hasDiff = c2;
    });
    let r2 = 0, h2 = 0;
    this.slides.forEach((e3, i3) => {
      let s3 = 0;
      e3.$el ? (i3 !== r2 || e3.hasDiff ? s3 = h2 + e3.hasDiff * t2 : h2 = 0, e3.$el.style.left = Math.abs(s3) > 0.1 ? `${h2 + e3.hasDiff * t2}px` : "", r2++) : h2 += e3.width;
    }), this.markSelectedSlides();
  }
  createSlideEl(t2) {
    if (!t2)
      return;
    if (t2.$el) {
      let e3 = t2.$el.dataset.index;
      if (!e3 || parseInt(e3, 10) !== t2.index) {
        let e4;
        t2.$el.dataset.index = t2.index, t2.$el.querySelectorAll("[data-lazy-srcset]").forEach((t3) => {
          t3.srcset = t3.dataset.lazySrcset;
        }), t2.$el.querySelectorAll("[data-lazy-src]").forEach((t3) => {
          let e5 = t3.dataset.lazySrc;
          t3 instanceof HTMLImageElement ? t3.src = e5 : t3.style.backgroundImage = `url('${e5}')`;
        }), (e4 = t2.$el.dataset.lazySrc) && (t2.$el.style.backgroundImage = `url('${e4}')`), t2.state = "ready";
      }
      return;
    }
    const e2 = document.createElement("div");
    e2.dataset.index = t2.index, e2.classList.add(...(this.option("prefix") + this.option("classNames.slide")).split(" ")), t2.customClass && e2.classList.add(...t2.customClass.split(" ")), t2.html && (e2.innerHTML = t2.html);
    const i2 = [];
    this.slides.forEach((t3, e3) => {
      t3.$el && i2.push(e3);
    });
    const s2 = t2.index;
    let o2 = null;
    if (i2.length) {
      let t3 = i2.reduce((t4, e3) => Math.abs(e3 - s2) < Math.abs(t4 - s2) ? e3 : t4);
      o2 = this.slides[t3];
    }
    return this.$track.insertBefore(e2, o2 && o2.$el ? o2.index < t2.index ? o2.$el.nextSibling : o2.$el : null), t2.$el = e2, this.trigger("createSlide", t2, s2), t2;
  }
  removeSlideEl(t2) {
    t2.$el && !t2.isDom && (this.trigger("removeSlide", t2), t2.$el.remove(), t2.$el = null);
  }
  markSelectedSlides() {
    const t2 = this.option("classNames.slideSelected"), e2 = "aria-hidden";
    this.slides.forEach((i2, s2) => {
      const o2 = i2.$el;
      if (!o2)
        return;
      const n2 = this.pages[this.page];
      n2 && n2.indexes && n2.indexes.indexOf(s2) > -1 ? (t2 && !o2.classList.contains(t2) && (o2.classList.add(t2), this.trigger("selectSlide", i2)), o2.removeAttribute(e2)) : (t2 && o2.classList.contains(t2) && (o2.classList.remove(t2), this.trigger("unselectSlide", i2)), o2.setAttribute(e2, true));
    });
  }
  updatePage() {
    this.updateMetrics(), this.slideTo(this.page, { friction: 0 });
  }
  onBeforeTransform() {
    this.option("infiniteX", this.option("infinite")) && this.manageInfiniteTrack(), this.manageSlideVisiblity();
  }
  manageInfiniteTrack() {
    const t2 = this.contentWidth, e2 = this.viewportWidth;
    if (!this.option("infiniteX", this.option("infinite")) || this.pages.length < 2 || t2 < e2)
      return;
    const i2 = this.Panzoom;
    let s2 = false;
    return i2.content.x < -1 * (t2 - e2) && (i2.content.x += t2, this.pageIndex = this.pageIndex - this.pages.length, s2 = true), i2.content.x > e2 && (i2.content.x -= t2, this.pageIndex = this.pageIndex + this.pages.length, s2 = true), s2 && "pointerdown" === i2.state && i2.resetDragPosition(), s2;
  }
  onTouchEnd(t2, e2) {
    const i2 = this.option("dragFree");
    if (!i2 && this.pages.length > 1 && t2.dragOffset.time < 350 && Math.abs(t2.dragOffset.y) < 1 && Math.abs(t2.dragOffset.x) > 5)
      this[t2.dragOffset.x < 0 ? "slideNext" : "slidePrev"]();
    else if (i2) {
      const [, e3] = this.getPageFromPosition(-1 * t2.transform.x);
      this.setPage(e3);
    } else
      this.slideToClosest();
  }
  slideToClosest(t2 = {}) {
    let [, e2] = this.getPageFromPosition(-1 * this.Panzoom.content.x);
    this.slideTo(e2, t2);
  }
  getPageFromPosition(t2) {
    const e2 = this.pages.length;
    this.option("center") && (t2 += 0.5 * this.viewportWidth);
    const i2 = Math.floor(t2 / this.contentWidth);
    t2 -= i2 * this.contentWidth;
    let s2 = this.slides.find((e3) => e3.left <= t2 && e3.left + e3.width > t2);
    if (s2) {
      let t3 = this.findPageForSlide(s2.index);
      return [t3, t3 + i2 * e2];
    }
    return [0, 0];
  }
  setPage(t2, e2) {
    let i2 = 0, s2 = parseInt(t2, 10) || 0;
    const o2 = this.page, n2 = this.pageIndex, a2 = this.pages.length, r2 = this.contentWidth, h2 = this.viewportWidth;
    if (t2 = (s2 % a2 + a2) % a2, this.option("infiniteX", this.option("infinite")) && r2 > h2) {
      const o3 = Math.floor(s2 / a2) || 0, n3 = r2;
      if (i2 = this.pages[t2].left + o3 * n3, true === e2 && a2 > 2) {
        let t3 = -1 * this.Panzoom.content.x;
        const e3 = i2 - n3, o4 = i2 + n3, r3 = Math.abs(t3 - i2), h3 = Math.abs(t3 - e3), l2 = Math.abs(t3 - o4);
        l2 < r3 && l2 <= h3 ? (i2 = o4, s2 += a2) : h3 < r3 && h3 < l2 && (i2 = e3, s2 -= a2);
      }
    } else
      t2 = s2 = Math.max(0, Math.min(s2, a2 - 1)), i2 = this.pages.length ? this.pages[t2].left : 0;
    return this.page = t2, this.pageIndex = s2, null !== o2 && t2 !== o2 && (this.prevPage = o2, this.prevPageIndex = n2, this.trigger("change", t2, o2)), i2;
  }
  destroy() {
    this.state = "destroy", this.slides.forEach((t2) => {
      this.removeSlideEl(t2);
    }), this.slides = [], this.Panzoom.destroy(), this.detachPlugins();
  }
}
y.version = "4.0.31", y.Plugins = p;
const v = !("undefined" == typeof window || !window.document || !window.document.createElement);
let b = null;
const x = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])'], w = (t2) => {
  if (t2 && v) {
    null === b && document.createElement("div").focus({ get preventScroll() {
      return b = true, false;
    } });
    try {
      if (t2.setActive)
        t2.setActive();
      else if (b)
        t2.focus({ preventScroll: true });
      else {
        const e2 = window.pageXOffset || document.body.scrollTop, i2 = window.pageYOffset || document.body.scrollLeft;
        t2.focus(), document.body.scrollTo({ top: e2, left: i2, behavior: "auto" });
      }
    } catch (t3) {
    }
  }
};
const $ = { minSlideCount: 2, minScreenHeight: 500, autoStart: true, key: "t", Carousel: {}, tpl: `<div class="fancybox__thumb" style="background-image:url('{{src}}')"></div>` };
class C {
  constructor(t2) {
    this.fancybox = t2, this.$container = null, this.state = "init";
    for (const t3 of ["onPrepare", "onClosing", "onKeydown"])
      this[t3] = this[t3].bind(this);
    this.events = { prepare: this.onPrepare, closing: this.onClosing, keydown: this.onKeydown };
  }
  onPrepare() {
    this.getSlides().length < this.fancybox.option("Thumbs.minSlideCount") ? this.state = "disabled" : true === this.fancybox.option("Thumbs.autoStart") && this.fancybox.Carousel.Panzoom.content.height >= this.fancybox.option("Thumbs.minScreenHeight") && this.build();
  }
  onClosing() {
    this.Carousel && this.Carousel.Panzoom.detachEvents();
  }
  onKeydown(t2, e2) {
    e2 === t2.option("Thumbs.key") && this.toggle();
  }
  build() {
    if (this.$container)
      return;
    const t2 = document.createElement("div");
    t2.classList.add("fancybox__thumbs"), this.fancybox.$carousel.parentNode.insertBefore(t2, this.fancybox.$carousel.nextSibling), this.Carousel = new y(t2, e(true, { Dots: false, Navigation: false, Sync: { friction: 0 }, infinite: false, center: true, fill: true, dragFree: true, slidesPerPage: 1, preload: 1 }, this.fancybox.option("Thumbs.Carousel"), { Sync: { target: this.fancybox.Carousel }, slides: this.getSlides() })), this.Carousel.Panzoom.on("wheel", (t3, e2) => {
      e2.preventDefault(), this.fancybox[e2.deltaY < 0 ? "prev" : "next"]();
    }), this.$container = t2, this.state = "visible";
  }
  getSlides() {
    const t2 = [];
    for (const e2 of this.fancybox.items) {
      const i2 = e2.thumb;
      i2 && t2.push({ html: this.fancybox.option("Thumbs.tpl").replace(/\{\{src\}\}/gi, i2), customClass: `has-thumb has-${e2.type || "image"}` });
    }
    return t2;
  }
  toggle() {
    "visible" === this.state ? this.hide() : "hidden" === this.state ? this.show() : this.build();
  }
  show() {
    "hidden" === this.state && (this.$container.style.display = "", this.Carousel.Panzoom.attachEvents(), this.state = "visible");
  }
  hide() {
    "visible" === this.state && (this.Carousel.Panzoom.detachEvents(), this.$container.style.display = "none", this.state = "hidden");
  }
  cleanup() {
    this.Carousel && (this.Carousel.destroy(), this.Carousel = null), this.$container && (this.$container.remove(), this.$container = null), this.state = "init";
  }
  attach() {
    this.fancybox.on(this.events);
  }
  detach() {
    this.fancybox.off(this.events), this.cleanup();
  }
}
C.defaults = $;
const S = (t2, e2) => {
  const i2 = new URL(t2), s2 = new URLSearchParams(i2.search);
  let o2 = new URLSearchParams();
  for (const [t3, i3] of [...s2, ...Object.entries(e2)])
    "t" === t3 ? o2.set("start", parseInt(i3)) : o2.set(t3, i3);
  o2 = o2.toString();
  let n2 = t2.match(/#t=((.*)?\d+s)/);
  return n2 && (o2 += `#t=${n2[1]}`), o2;
}, E = { video: { autoplay: true, ratio: 16 / 9 }, youtube: { autohide: 1, fs: 1, rel: 0, hd: 1, wmode: "transparent", enablejsapi: 1, html5: 1 }, vimeo: { hd: 1, show_title: 1, show_byline: 1, show_portrait: 0, fullscreen: 1 }, html5video: { tpl: `<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">
  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`, format: "" } };
class P {
  constructor(t2) {
    this.fancybox = t2;
    for (const t3 of ["onInit", "onReady", "onCreateSlide", "onRemoveSlide", "onSelectSlide", "onUnselectSlide", "onRefresh", "onMessage"])
      this[t3] = this[t3].bind(this);
    this.events = { init: this.onInit, ready: this.onReady, "Carousel.createSlide": this.onCreateSlide, "Carousel.removeSlide": this.onRemoveSlide, "Carousel.selectSlide": this.onSelectSlide, "Carousel.unselectSlide": this.onUnselectSlide, "Carousel.refresh": this.onRefresh };
  }
  onInit() {
    for (const t2 of this.fancybox.items)
      this.processType(t2);
  }
  processType(t2) {
    if (t2.html)
      return t2.src = t2.html, t2.type = "html", void delete t2.html;
    const i2 = t2.src || "";
    let s2 = t2.type || this.fancybox.options.type, o2 = null;
    if (!i2 || "string" == typeof i2) {
      if (o2 = i2.match(/(?:youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i)) {
        const e2 = S(i2, this.fancybox.option("Html.youtube")), n2 = encodeURIComponent(o2[1]);
        t2.videoId = n2, t2.src = `https://www.youtube-nocookie.com/embed/${n2}?${e2}`, t2.thumb = t2.thumb || `https://i.ytimg.com/vi/${n2}/mqdefault.jpg`, t2.vendor = "youtube", s2 = "video";
      } else if (o2 = i2.match(/^.+vimeo.com\/(?:\/)?([\d]+)(.*)?/)) {
        const e2 = S(i2, this.fancybox.option("Html.vimeo")), n2 = encodeURIComponent(o2[1]);
        t2.videoId = n2, t2.src = `https://player.vimeo.com/video/${n2}?${e2}`, t2.vendor = "vimeo", s2 = "video";
      } else
        (o2 = i2.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i)) ? (t2.src = `//maps.google.${o2[1]}/?ll=${(o2[2] ? o2[2] + "&z=" + Math.floor(o2[3]) + (o2[4] ? o2[4].replace(/^\//, "&") : "") : o2[4] + "").replace(/\?/, "&")}&output=${o2[4] && o2[4].indexOf("layer=c") > 0 ? "svembed" : "embed"}`, s2 = "map") : (o2 = i2.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i)) && (t2.src = `//maps.google.${o2[1]}/maps?q=${o2[2].replace("query=", "q=").replace("api=1", "")}&output=embed`, s2 = "map");
      s2 || ("#" === i2.charAt(0) ? s2 = "inline" : (o2 = i2.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? (s2 = "html5video", t2.format = t2.format || "video/" + ("ogv" === o2[1] ? "ogg" : o2[1])) : i2.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? s2 = "image" : i2.match(/\.(pdf)((\?|#).*)?$/i) && (s2 = "pdf")), t2.type = s2 || this.fancybox.option("defaultType", "image"), "html5video" !== s2 && "video" !== s2 || (t2.video = e({}, this.fancybox.option("Html.video"), t2.video), t2._width && t2._height ? t2.ratio = parseFloat(t2._width) / parseFloat(t2._height) : t2.ratio = t2.ratio || t2.video.ratio || E.video.ratio);
    }
  }
  onReady() {
    this.fancybox.Carousel.slides.forEach((t2) => {
      t2.$el && (this.setContent(t2), t2.index === this.fancybox.getSlide().index && this.playVideo(t2));
    });
  }
  onCreateSlide(t2, e2, i2) {
    "ready" === this.fancybox.state && this.setContent(i2);
  }
  loadInlineContent(t2) {
    let e2;
    if (t2.src instanceof HTMLElement)
      e2 = t2.src;
    else if ("string" == typeof t2.src) {
      const i2 = t2.src.split("#", 2), s2 = 2 === i2.length && "" === i2[0] ? i2[1] : i2[0];
      e2 = document.getElementById(s2);
    }
    if (e2) {
      if ("clone" === t2.type || e2.$placeHolder) {
        e2 = e2.cloneNode(true);
        let i2 = e2.getAttribute("id");
        i2 = i2 ? `${i2}--clone` : `clone-${this.fancybox.id}-${t2.index}`, e2.setAttribute("id", i2);
      } else {
        const t3 = document.createElement("div");
        t3.classList.add("fancybox-placeholder"), e2.parentNode.insertBefore(t3, e2), e2.$placeHolder = t3;
      }
      this.fancybox.setContent(t2, e2);
    } else
      this.fancybox.setError(t2, "{{ELEMENT_NOT_FOUND}}");
  }
  loadAjaxContent(t2) {
    const e2 = this.fancybox, i2 = new XMLHttpRequest();
    e2.showLoading(t2), i2.onreadystatechange = function() {
      i2.readyState === XMLHttpRequest.DONE && "ready" === e2.state && (e2.hideLoading(t2), 200 === i2.status ? e2.setContent(t2, i2.responseText) : e2.setError(t2, 404 === i2.status ? "{{AJAX_NOT_FOUND}}" : "{{AJAX_FORBIDDEN}}"));
    };
    const s2 = t2.ajax || null;
    i2.open(s2 ? "POST" : "GET", t2.src), i2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), i2.setRequestHeader("X-Requested-With", "XMLHttpRequest"), i2.send(s2), t2.xhr = i2;
  }
  loadIframeContent(t2) {
    const e2 = this.fancybox, i2 = document.createElement("iframe");
    if (i2.className = "fancybox__iframe", i2.setAttribute("id", `fancybox__iframe_${e2.id}_${t2.index}`), i2.setAttribute("allow", "autoplay; fullscreen"), i2.setAttribute("scrolling", "auto"), t2.$iframe = i2, "iframe" !== t2.type || false === t2.preload)
      return i2.setAttribute("src", t2.src), this.fancybox.setContent(t2, i2), void this.resizeIframe(t2);
    e2.showLoading(t2);
    const s2 = document.createElement("div");
    s2.style.visibility = "hidden", this.fancybox.setContent(t2, s2), s2.appendChild(i2), i2.onerror = () => {
      e2.setError(t2, "{{IFRAME_ERROR}}");
    }, i2.onload = () => {
      e2.hideLoading(t2);
      let s3 = false;
      i2.isReady || (i2.isReady = true, s3 = true), i2.src.length && (i2.parentNode.style.visibility = "", this.resizeIframe(t2), s3 && e2.revealContent(t2));
    }, i2.setAttribute("src", t2.src);
  }
  setAspectRatio(t2) {
    const e2 = t2.$content, i2 = t2.ratio;
    if (!e2)
      return;
    let s2 = t2._width, o2 = t2._height;
    if (i2 || s2 && o2) {
      Object.assign(e2.style, { width: s2 && o2 ? "100%" : "", height: s2 && o2 ? "100%" : "", maxWidth: "", maxHeight: "" });
      let t3 = e2.offsetWidth, n2 = e2.offsetHeight;
      if (s2 = s2 || t3, o2 = o2 || n2, s2 > t3 || o2 > n2) {
        let e3 = Math.min(t3 / s2, n2 / o2);
        s2 *= e3, o2 *= e3;
      }
      Math.abs(s2 / o2 - i2) > 0.01 && (i2 < s2 / o2 ? s2 = o2 * i2 : o2 = s2 / i2), Object.assign(e2.style, { width: `${s2}px`, height: `${o2}px` });
    }
  }
  resizeIframe(t2) {
    const e2 = t2.$iframe;
    if (!e2)
      return;
    let i2 = t2._width || 0, s2 = t2._height || 0;
    i2 && s2 && (t2.autoSize = false);
    const o2 = e2.parentNode, n2 = o2 && o2.style;
    if (false !== t2.preload && false !== t2.autoSize && n2)
      try {
        const t3 = window.getComputedStyle(o2), a2 = parseFloat(t3.paddingLeft) + parseFloat(t3.paddingRight), r2 = parseFloat(t3.paddingTop) + parseFloat(t3.paddingBottom), h2 = e2.contentWindow.document, l2 = h2.getElementsByTagName("html")[0], c2 = h2.body;
        n2.width = "", c2.style.overflow = "hidden", i2 = i2 || l2.scrollWidth + a2, n2.width = `${i2}px`, c2.style.overflow = "", n2.flex = "0 0 auto", n2.height = `${c2.scrollHeight}px`, s2 = l2.scrollHeight + r2;
      } catch (t3) {
      }
    if (i2 || s2) {
      const t3 = { flex: "0 1 auto" };
      i2 && (t3.width = `${i2}px`), s2 && (t3.height = `${s2}px`), Object.assign(n2, t3);
    }
  }
  onRefresh(t2, e2) {
    e2.slides.forEach((t3) => {
      t3.$el && (t3.$iframe && this.resizeIframe(t3), t3.ratio && this.setAspectRatio(t3));
    });
  }
  setContent(t2) {
    if (t2 && !t2.isDom) {
      switch (t2.type) {
        case "html":
          this.fancybox.setContent(t2, t2.src);
          break;
        case "html5video":
          this.fancybox.setContent(t2, this.fancybox.option("Html.html5video.tpl").replace(/\{\{src\}\}/gi, t2.src).replace("{{format}}", t2.format || t2.html5video && t2.html5video.format || "").replace("{{poster}}", t2.poster || t2.thumb || ""));
          break;
        case "inline":
        case "clone":
          this.loadInlineContent(t2);
          break;
        case "ajax":
          this.loadAjaxContent(t2);
          break;
        case "pdf":
        case "video":
        case "map":
          t2.preload = false;
        case "iframe":
          this.loadIframeContent(t2);
      }
      t2.ratio && this.setAspectRatio(t2);
    }
  }
  onSelectSlide(t2, e2, i2) {
    "ready" === t2.state && this.playVideo(i2);
  }
  playVideo(t2) {
    if ("html5video" === t2.type && t2.video.autoplay)
      try {
        const e3 = t2.$el.querySelector("video");
        if (e3) {
          const t3 = e3.play();
          void 0 !== t3 && t3.then(() => {
          }).catch((t4) => {
            e3.muted = true, e3.play();
          });
        }
      } catch (t3) {
      }
    if ("video" !== t2.type || !t2.$iframe || !t2.$iframe.contentWindow)
      return;
    const e2 = () => {
      if ("done" === t2.state && t2.$iframe && t2.$iframe.contentWindow) {
        let e3;
        if (t2.$iframe.isReady)
          return t2.video && t2.video.autoplay && (e3 = "youtube" == t2.vendor ? { event: "command", func: "playVideo" } : { method: "play", value: "true" }), void (e3 && t2.$iframe.contentWindow.postMessage(JSON.stringify(e3), "*"));
        "youtube" === t2.vendor && (e3 = { event: "listening", id: t2.$iframe.getAttribute("id") }, t2.$iframe.contentWindow.postMessage(JSON.stringify(e3), "*"));
      }
      t2.poller = setTimeout(e2, 250);
    };
    e2();
  }
  onUnselectSlide(t2, e2, i2) {
    if ("html5video" === i2.type) {
      try {
        i2.$el.querySelector("video").pause();
      } catch (t3) {
      }
      return;
    }
    let s2 = false;
    "vimeo" == i2.vendor ? s2 = { method: "pause", value: "true" } : "youtube" === i2.vendor && (s2 = { event: "command", func: "pauseVideo" }), s2 && i2.$iframe && i2.$iframe.contentWindow && i2.$iframe.contentWindow.postMessage(JSON.stringify(s2), "*"), clearTimeout(i2.poller);
  }
  onRemoveSlide(t2, e2, i2) {
    i2.xhr && (i2.xhr.abort(), i2.xhr = null), i2.$iframe && (i2.$iframe.onload = i2.$iframe.onerror = null, i2.$iframe.src = "//about:blank", i2.$iframe = null);
    const s2 = i2.$content;
    "inline" === i2.type && s2 && (s2.classList.remove("fancybox__content"), "none" !== s2.style.display && (s2.style.display = "none")), i2.$closeButton && (i2.$closeButton.remove(), i2.$closeButton = null);
    const o2 = s2 && s2.$placeHolder;
    o2 && (o2.parentNode.insertBefore(s2, o2), o2.remove(), s2.$placeHolder = null);
  }
  onMessage(t2) {
    try {
      let e2 = JSON.parse(t2.data);
      if ("https://player.vimeo.com" === t2.origin) {
        if ("ready" === e2.event)
          for (let e3 of document.getElementsByClassName("fancybox__iframe"))
            e3.contentWindow === t2.source && (e3.isReady = 1);
      } else
        "https://www.youtube-nocookie.com" === t2.origin && "onReady" === e2.event && (document.getElementById(e2.id).isReady = 1);
    } catch (t3) {
    }
  }
  attach() {
    this.fancybox.on(this.events), window.addEventListener("message", this.onMessage, false);
  }
  detach() {
    this.fancybox.off(this.events), window.removeEventListener("message", this.onMessage, false);
  }
}
P.defaults = E;
class T {
  constructor(t2) {
    this.fancybox = t2;
    for (const t3 of ["onReady", "onClosing", "onDone", "onPageChange", "onCreateSlide", "onRemoveSlide", "onImageStatusChange"])
      this[t3] = this[t3].bind(this);
    this.events = { ready: this.onReady, closing: this.onClosing, done: this.onDone, "Carousel.change": this.onPageChange, "Carousel.createSlide": this.onCreateSlide, "Carousel.removeSlide": this.onRemoveSlide };
  }
  onReady() {
    this.fancybox.Carousel.slides.forEach((t2) => {
      t2.$el && this.setContent(t2);
    });
  }
  onDone(t2, e2) {
    this.handleCursor(e2);
  }
  onClosing(t2) {
    clearTimeout(this.clickTimer), this.clickTimer = null, t2.Carousel.slides.forEach((t3) => {
      t3.$image && (t3.state = "destroy"), t3.Panzoom && t3.Panzoom.detachEvents();
    }), "closing" === this.fancybox.state && this.canZoom(t2.getSlide()) && this.zoomOut();
  }
  onCreateSlide(t2, e2, i2) {
    "ready" === this.fancybox.state && this.setContent(i2);
  }
  onRemoveSlide(t2, e2, i2) {
    i2.$image && (i2.$el.classList.remove(t2.option("Image.canZoomInClass")), i2.$image.remove(), i2.$image = null), i2.Panzoom && (i2.Panzoom.destroy(), i2.Panzoom = null), i2.$el && i2.$el.dataset && delete i2.$el.dataset.imageFit;
  }
  setContent(t2) {
    if (t2.isDom || t2.html || t2.type && "image" !== t2.type)
      return;
    if (t2.$image)
      return;
    t2.type = "image", t2.state = "loading";
    const e2 = document.createElement("div");
    e2.style.visibility = "hidden";
    const i2 = document.createElement("img");
    i2.addEventListener("load", (e3) => {
      e3.stopImmediatePropagation(), this.onImageStatusChange(t2);
    }), i2.addEventListener("error", () => {
      this.onImageStatusChange(t2);
    }), i2.src = t2.src, i2.alt = "", i2.draggable = false, i2.classList.add("fancybox__image"), t2.srcset && i2.setAttribute("srcset", t2.srcset), t2.sizes && i2.setAttribute("sizes", t2.sizes), t2.$image = i2;
    const s2 = this.fancybox.option("Image.wrap");
    if (s2) {
      const o2 = document.createElement("div");
      o2.classList.add("string" == typeof s2 ? s2 : "fancybox__image-wrap"), o2.appendChild(i2), e2.appendChild(o2), t2.$wrap = o2;
    } else
      e2.appendChild(i2);
    t2.$el.dataset.imageFit = this.fancybox.option("Image.fit"), this.fancybox.setContent(t2, e2), i2.complete || i2.error ? this.onImageStatusChange(t2) : this.fancybox.showLoading(t2);
  }
  onImageStatusChange(t2) {
    const e2 = t2.$image;
    e2 && "loading" === t2.state && (e2.complete && e2.naturalWidth && e2.naturalHeight ? (this.fancybox.hideLoading(t2), "contain" === this.fancybox.option("Image.fit") && this.initSlidePanzoom(t2), t2.$el.addEventListener("wheel", (e3) => this.onWheel(t2, e3), { passive: false }), t2.$content.addEventListener("click", (e3) => this.onClick(t2, e3), { passive: false }), this.revealContent(t2)) : this.fancybox.setError(t2, "{{IMAGE_ERROR}}"));
  }
  initSlidePanzoom(t2) {
    t2.Panzoom || (t2.Panzoom = new d(t2.$el, e(true, this.fancybox.option("Image.Panzoom", {}), { viewport: t2.$wrap, content: t2.$image, width: t2._width, height: t2._height, wrapInner: false, textSelection: true, touch: this.fancybox.option("Image.touch"), panOnlyZoomed: true, click: false, wheel: false })), t2.Panzoom.on("startAnimation", () => {
      this.fancybox.trigger("Image.startAnimation", t2);
    }), t2.Panzoom.on("endAnimation", () => {
      "zoomIn" === t2.state && this.fancybox.done(t2), this.handleCursor(t2), this.fancybox.trigger("Image.endAnimation", t2);
    }), t2.Panzoom.on("afterUpdate", () => {
      this.handleCursor(t2), this.fancybox.trigger("Image.afterUpdate", t2);
    }));
  }
  revealContent(t2) {
    null === this.fancybox.Carousel.prevPage && t2.index === this.fancybox.options.startIndex && this.canZoom(t2) ? this.zoomIn() : this.fancybox.revealContent(t2);
  }
  getZoomInfo(t2) {
    const e2 = t2.$thumb.getBoundingClientRect(), i2 = e2.width, s2 = e2.height, o2 = t2.$content.getBoundingClientRect(), n2 = o2.width, a2 = o2.height, r2 = o2.top - e2.top, h2 = o2.left - e2.left;
    let l2 = this.fancybox.option("Image.zoomOpacity");
    return "auto" === l2 && (l2 = Math.abs(i2 / s2 - n2 / a2) > 0.1), { top: r2, left: h2, scale: n2 && i2 ? i2 / n2 : 1, opacity: l2 };
  }
  canZoom(t2) {
    const e2 = this.fancybox, i2 = e2.$container;
    if (window.visualViewport && 1 !== window.visualViewport.scale)
      return false;
    if (t2.Panzoom && !t2.Panzoom.content.width)
      return false;
    if (!e2.option("Image.zoom") || "contain" !== e2.option("Image.fit"))
      return false;
    const s2 = t2.$thumb;
    if (!s2 || "loading" === t2.state)
      return false;
    i2.classList.add("fancybox__no-click");
    const o2 = s2.getBoundingClientRect();
    let n2;
    if (this.fancybox.option("Image.ignoreCoveredThumbnail")) {
      const t3 = document.elementFromPoint(o2.left + 1, o2.top + 1) === s2, e3 = document.elementFromPoint(o2.right - 1, o2.bottom - 1) === s2;
      n2 = t3 && e3;
    } else
      n2 = document.elementFromPoint(o2.left + 0.5 * o2.width, o2.top + 0.5 * o2.height) === s2;
    return i2.classList.remove("fancybox__no-click"), n2;
  }
  zoomIn() {
    const t2 = this.fancybox, e2 = t2.getSlide(), i2 = e2.Panzoom, { top: s2, left: o2, scale: n2, opacity: a2 } = this.getZoomInfo(e2);
    t2.trigger("reveal", e2), i2.panTo({ x: -1 * o2, y: -1 * s2, scale: n2, friction: 0, ignoreBounds: true }), e2.$content.style.visibility = "", e2.state = "zoomIn", true === a2 && i2.on("afterTransform", (t3) => {
      "zoomIn" !== e2.state && "zoomOut" !== e2.state || (t3.$content.style.opacity = Math.min(1, 1 - (1 - t3.content.scale) / (1 - n2)));
    }), i2.panTo({ x: 0, y: 0, scale: 1, friction: this.fancybox.option("Image.zoomFriction") });
  }
  zoomOut() {
    const t2 = this.fancybox, e2 = t2.getSlide(), i2 = e2.Panzoom;
    if (!i2)
      return;
    e2.state = "zoomOut", t2.state = "customClosing", e2.$caption && (e2.$caption.style.visibility = "hidden");
    let s2 = this.fancybox.option("Image.zoomFriction");
    const o2 = (t3) => {
      const { top: o3, left: n2, scale: a2, opacity: r2 } = this.getZoomInfo(e2);
      t3 || r2 || (s2 *= 0.82), i2.panTo({ x: -1 * n2, y: -1 * o3, scale: a2, friction: s2, ignoreBounds: true }), s2 *= 0.98;
    };
    window.addEventListener("scroll", o2), i2.once("endAnimation", () => {
      window.removeEventListener("scroll", o2), t2.destroy();
    }), o2();
  }
  handleCursor(t2) {
    if ("image" !== t2.type || !t2.$el)
      return;
    const e2 = t2.Panzoom, i2 = this.fancybox.option("Image.click", false, t2), s2 = this.fancybox.option("Image.touch"), o2 = t2.$el.classList, n2 = this.fancybox.option("Image.canZoomInClass"), a2 = this.fancybox.option("Image.canZoomOutClass");
    if (o2.remove(a2), o2.remove(n2), e2 && "toggleZoom" === i2) {
      e2 && 1 === e2.content.scale && e2.option("maxScale") - e2.content.scale > 0.01 ? o2.add(n2) : e2.content.scale > 1 && !s2 && o2.add(a2);
    } else
      "close" === i2 && o2.add(a2);
  }
  onWheel(t2, e2) {
    if ("ready" === this.fancybox.state && false !== this.fancybox.trigger("Image.wheel", e2))
      switch (this.fancybox.option("Image.wheel")) {
        case "zoom":
          "done" === t2.state && t2.Panzoom && t2.Panzoom.zoomWithWheel(e2);
          break;
        case "close":
          this.fancybox.close();
          break;
        case "slide":
          this.fancybox[e2.deltaY < 0 ? "prev" : "next"]();
      }
  }
  onClick(t2, e2) {
    if ("ready" !== this.fancybox.state)
      return;
    const i2 = t2.Panzoom;
    if (i2 && (i2.dragPosition.midPoint || 0 !== i2.dragOffset.x || 0 !== i2.dragOffset.y || 1 !== i2.dragOffset.scale))
      return;
    if (this.fancybox.Carousel.Panzoom.lockAxis)
      return false;
    const s2 = (i3) => {
      switch (i3) {
        case "toggleZoom":
          e2.stopPropagation(), t2.Panzoom && t2.Panzoom.zoomWithClick(e2);
          break;
        case "close":
          this.fancybox.close();
          break;
        case "next":
          e2.stopPropagation(), this.fancybox.next();
      }
    }, o2 = this.fancybox.option("Image.click"), n2 = this.fancybox.option("Image.doubleClick");
    n2 ? this.clickTimer ? (clearTimeout(this.clickTimer), this.clickTimer = null, s2(n2)) : this.clickTimer = setTimeout(() => {
      this.clickTimer = null, s2(o2);
    }, 300) : s2(o2);
  }
  onPageChange(t2, e2) {
    const i2 = t2.getSlide();
    e2.slides.forEach((t3) => {
      t3.Panzoom && "done" === t3.state && t3.index !== i2.index && t3.Panzoom.panTo({ x: 0, y: 0, scale: 1, friction: 0.8 });
    });
  }
  attach() {
    this.fancybox.on(this.events);
  }
  detach() {
    this.fancybox.off(this.events);
  }
}
T.defaults = { canZoomInClass: "can-zoom_in", canZoomOutClass: "can-zoom_out", zoom: true, zoomOpacity: "auto", zoomFriction: 0.82, ignoreCoveredThumbnail: false, touch: true, click: "toggleZoom", doubleClick: null, wheel: "zoom", fit: "contain", wrap: false, Panzoom: { ratio: 1 } };
class L {
  constructor(t2) {
    this.fancybox = t2;
    for (const t3 of ["onChange", "onClosing"])
      this[t3] = this[t3].bind(this);
    this.events = { initCarousel: this.onChange, "Carousel.change": this.onChange, closing: this.onClosing }, this.hasCreatedHistory = false, this.origHash = "", this.timer = null;
  }
  onChange(t2) {
    const e2 = t2.Carousel;
    this.timer && clearTimeout(this.timer);
    const i2 = null === e2.prevPage, s2 = t2.getSlide(), o2 = new URL(document.URL).hash;
    let n2 = false;
    if (s2.slug)
      n2 = "#" + s2.slug;
    else {
      const i3 = s2.$trigger && s2.$trigger.dataset, o3 = t2.option("slug") || i3 && i3.fancybox;
      o3 && o3.length && "true" !== o3 && (n2 = "#" + o3 + (e2.slides.length > 1 ? "-" + (s2.index + 1) : ""));
    }
    i2 && (this.origHash = o2 !== n2 ? o2 : ""), n2 && o2 !== n2 && (this.timer = setTimeout(() => {
      try {
        window.history[i2 ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + n2), i2 && (this.hasCreatedHistory = true);
      } catch (t3) {
      }
    }, 300));
  }
  onClosing() {
    if (this.timer && clearTimeout(this.timer), true !== this.hasSilentClose)
      try {
        return void window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (this.origHash || ""));
      } catch (t2) {
      }
  }
  attach(t2) {
    t2.on(this.events);
  }
  detach(t2) {
    t2.off(this.events);
  }
  static startFromUrl() {
    const t2 = L.Fancybox;
    if (!t2 || t2.getInstance() || false === t2.defaults.Hash)
      return;
    const { hash: e2, slug: i2, index: s2 } = L.getParsedURL();
    if (!i2)
      return;
    let o2 = document.querySelector(`[data-slug="${e2}"]`);
    if (o2 && o2.dispatchEvent(new CustomEvent("click", { bubbles: true, cancelable: true })), t2.getInstance())
      return;
    const n2 = document.querySelectorAll(`[data-fancybox="${i2}"]`);
    n2.length && (null === s2 && 1 === n2.length ? o2 = n2[0] : s2 && (o2 = n2[s2 - 1]), o2 && o2.dispatchEvent(new CustomEvent("click", { bubbles: true, cancelable: true })));
  }
  static onHashChange() {
    const { slug: t2, index: e2 } = L.getParsedURL(), i2 = L.Fancybox, s2 = i2 && i2.getInstance();
    if (s2 && s2.plugins.Hash) {
      if (t2) {
        const i3 = s2.Carousel;
        if (t2 === s2.option("slug"))
          return i3.slideTo(e2 - 1);
        for (let e3 of i3.slides)
          if (e3.slug && e3.slug === t2)
            return i3.slideTo(e3.index);
        const o2 = s2.getSlide(), n2 = o2.$trigger && o2.$trigger.dataset;
        if (n2 && n2.fancybox === t2)
          return i3.slideTo(e2 - 1);
      }
      s2.plugins.Hash.hasSilentClose = true, s2.close();
    }
    L.startFromUrl();
  }
  static create(t2) {
    function e2() {
      window.addEventListener("hashchange", L.onHashChange, false), L.startFromUrl();
    }
    L.Fancybox = t2, v && window.requestAnimationFrame(() => {
      /complete|interactive|loaded/.test(document.readyState) ? e2() : document.addEventListener("DOMContentLoaded", e2);
    });
  }
  static destroy() {
    window.removeEventListener("hashchange", L.onHashChange, false);
  }
  static getParsedURL() {
    const t2 = window.location.hash.substr(1), e2 = t2.split("-"), i2 = e2.length > 1 && /^\+?\d+$/.test(e2[e2.length - 1]) && parseInt(e2.pop(-1), 10) || null;
    return { hash: t2, slug: e2.join("-"), index: i2 };
  }
}
const _ = { pageXOffset: 0, pageYOffset: 0, element: () => document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement, activate(t2) {
  _.pageXOffset = window.pageXOffset, _.pageYOffset = window.pageYOffset, t2.requestFullscreen ? t2.requestFullscreen() : t2.mozRequestFullScreen ? t2.mozRequestFullScreen() : t2.webkitRequestFullscreen ? t2.webkitRequestFullscreen() : t2.msRequestFullscreen && t2.msRequestFullscreen();
}, deactivate() {
  document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
} };
class A {
  constructor(t2) {
    this.fancybox = t2, this.active = false, this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }
  isActive() {
    return this.active;
  }
  setTimer() {
    if (!this.active || this.timer)
      return;
    const t2 = this.fancybox.option("slideshow.delay", 3e3);
    this.timer = setTimeout(() => {
      this.timer = null, this.fancybox.option("infinite") || this.fancybox.getSlide().index !== this.fancybox.Carousel.slides.length - 1 ? this.fancybox.next() : this.fancybox.jumpTo(0, { friction: 0 });
    }, t2);
    let e2 = this.$progress;
    e2 || (e2 = document.createElement("div"), e2.classList.add("fancybox__progress"), this.fancybox.$carousel.parentNode.insertBefore(e2, this.fancybox.$carousel), this.$progress = e2, e2.offsetHeight), e2.style.transitionDuration = `${t2}ms`, e2.style.transform = "scaleX(1)";
  }
  clearTimer() {
    clearTimeout(this.timer), this.timer = null, this.$progress && (this.$progress.style.transitionDuration = "", this.$progress.style.transform = "", this.$progress.offsetHeight);
  }
  activate() {
    this.active || (this.active = true, this.fancybox.$container.classList.add("has-slideshow"), "done" === this.fancybox.getSlide().state && this.setTimer(), document.addEventListener("visibilitychange", this.handleVisibilityChange, false));
  }
  handleVisibilityChange() {
    this.deactivate();
  }
  deactivate() {
    this.active = false, this.clearTimer(), this.fancybox.$container.classList.remove("has-slideshow"), document.removeEventListener("visibilitychange", this.handleVisibilityChange, false);
  }
  toggle() {
    this.active ? this.deactivate() : this.fancybox.Carousel.slides.length > 1 && this.activate();
  }
}
const z = { display: ["counter", "zoom", "slideshow", "fullscreen", "thumbs", "close"], autoEnable: true, items: { counter: { position: "left", type: "div", class: "fancybox__counter", html: '<span data-fancybox-index=""></span>&nbsp;/&nbsp;<span data-fancybox-count=""></span>', attr: { tabindex: -1 } }, prev: { type: "button", class: "fancybox__button--prev", label: "PREV", html: '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8"/></svg>', attr: { "data-fancybox-prev": "" } }, next: { type: "button", class: "fancybox__button--next", label: "NEXT", html: '<svg viewBox="0 0 24 24"><path d="M8 4l8 8-8 8"/></svg>', attr: { "data-fancybox-next": "" } }, fullscreen: { type: "button", class: "fancybox__button--fullscreen", label: "TOGGLE_FULLSCREEN", html: '<svg viewBox="0 0 24 24">\n                <g><path d="M3 8 V3h5"></path><path d="M21 8V3h-5"></path><path d="M8 21H3v-5"></path><path d="M16 21h5v-5"></path></g>\n                <g><path d="M7 2v5H2M17 2v5h5M2 17h5v5M22 17h-5v5"/></g>\n            </svg>', click: function(t2) {
  t2.preventDefault(), _.element() ? _.deactivate() : _.activate(this.fancybox.$container);
} }, slideshow: { type: "button", class: "fancybox__button--slideshow", label: "TOGGLE_SLIDESHOW", html: '<svg viewBox="0 0 24 24">\n                <g><path d="M6 4v16"/><path d="M20 12L6 20"/><path d="M20 12L6 4"/></g>\n                <g><path d="M7 4v15M17 4v15"/></g>\n            </svg>', click: function(t2) {
  t2.preventDefault(), this.Slideshow.toggle();
} }, zoom: { type: "button", class: "fancybox__button--zoom", label: "TOGGLE_ZOOM", html: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></svg>', click: function(t2) {
  t2.preventDefault();
  const e2 = this.fancybox.getSlide().Panzoom;
  e2 && e2.toggleZoom();
} }, download: { type: "link", label: "DOWNLOAD", class: "fancybox__button--download", html: '<svg viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.62 2.48A2 2 0 004.56 21h14.88a2 2 0 001.94-1.51L22 17"/></svg>', click: function(t2) {
  t2.stopPropagation();
} }, thumbs: { type: "button", label: "TOGGLE_THUMBS", class: "fancybox__button--thumbs", html: '<svg viewBox="0 0 24 24"><circle cx="4" cy="4" r="1" /><circle cx="12" cy="4" r="1" transform="rotate(90 12 4)"/><circle cx="20" cy="4" r="1" transform="rotate(90 20 4)"/><circle cx="4" cy="12" r="1" transform="rotate(90 4 12)"/><circle cx="12" cy="12" r="1" transform="rotate(90 12 12)"/><circle cx="20" cy="12" r="1" transform="rotate(90 20 12)"/><circle cx="4" cy="20" r="1" transform="rotate(90 4 20)"/><circle cx="12" cy="20" r="1" transform="rotate(90 12 20)"/><circle cx="20" cy="20" r="1" transform="rotate(90 20 20)"/></svg>', click: function(t2) {
  t2.stopPropagation();
  const e2 = this.fancybox.plugins.Thumbs;
  e2 && e2.toggle();
} }, close: { type: "button", label: "CLOSE", class: "fancybox__button--close", html: '<svg viewBox="0 0 24 24"><path d="M20 20L4 4m16 0L4 20"></path></svg>', attr: { "data-fancybox-close": "", tabindex: 0 } } } };
class k {
  constructor(t2) {
    this.fancybox = t2, this.$container = null, this.state = "init";
    for (const t3 of ["onInit", "onPrepare", "onDone", "onKeydown", "onClosing", "onChange", "onSettle", "onRefresh"])
      this[t3] = this[t3].bind(this);
    this.events = { init: this.onInit, prepare: this.onPrepare, done: this.onDone, keydown: this.onKeydown, closing: this.onClosing, "Carousel.change": this.onChange, "Carousel.settle": this.onSettle, "Carousel.Panzoom.touchStart": () => this.onRefresh(), "Image.startAnimation": (t3, e2) => this.onRefresh(e2), "Image.afterUpdate": (t3, e2) => this.onRefresh(e2) };
  }
  onInit() {
    if (this.fancybox.option("Toolbar.autoEnable")) {
      let t2 = false;
      for (const e2 of this.fancybox.items)
        if ("image" === e2.type) {
          t2 = true;
          break;
        }
      if (!t2)
        return void (this.state = "disabled");
    }
    for (const e2 of this.fancybox.option("Toolbar.display")) {
      if ("close" === (t(e2) ? e2.id : e2)) {
        this.fancybox.options.closeButton = false;
        break;
      }
    }
  }
  onPrepare() {
    const t2 = this.fancybox;
    if ("init" === this.state && (this.build(), this.update(), this.Slideshow = new A(t2), !t2.Carousel.prevPage && (t2.option("slideshow.autoStart") && this.Slideshow.activate(), t2.option("fullscreen.autoStart") && !_.element())))
      try {
        _.activate(t2.$container);
      } catch (t3) {
      }
  }
  onFsChange() {
    window.scrollTo(_.pageXOffset, _.pageYOffset);
  }
  onSettle() {
    const t2 = this.fancybox, e2 = this.Slideshow;
    e2 && e2.isActive() && (t2.getSlide().index !== t2.Carousel.slides.length - 1 || t2.option("infinite") ? "done" === t2.getSlide().state && e2.setTimer() : e2.deactivate());
  }
  onChange() {
    this.update(), this.Slideshow && this.Slideshow.isActive() && this.Slideshow.clearTimer();
  }
  onDone(t2, e2) {
    const i2 = this.Slideshow;
    e2.index === t2.getSlide().index && (this.update(), i2 && i2.isActive() && (t2.option("infinite") || e2.index !== t2.Carousel.slides.length - 1 ? i2.setTimer() : i2.deactivate()));
  }
  onRefresh(t2) {
    t2 && t2.index !== this.fancybox.getSlide().index || (this.update(), !this.Slideshow || !this.Slideshow.isActive() || t2 && "done" !== t2.state || this.Slideshow.deactivate());
  }
  onKeydown(t2, e2, i2) {
    " " === e2 && this.Slideshow && (this.Slideshow.toggle(), i2.preventDefault());
  }
  onClosing() {
    this.Slideshow && this.Slideshow.deactivate(), document.removeEventListener("fullscreenchange", this.onFsChange);
  }
  createElement(t2) {
    let e2;
    "div" === t2.type ? e2 = document.createElement("div") : (e2 = document.createElement("link" === t2.type ? "a" : "button"), e2.classList.add("carousel__button")), e2.innerHTML = t2.html, e2.setAttribute("tabindex", t2.tabindex || 0), t2.class && e2.classList.add(...t2.class.split(" "));
    for (const i3 in t2.attr)
      e2.setAttribute(i3, t2.attr[i3]);
    t2.label && e2.setAttribute("title", this.fancybox.localize(`{{${t2.label}}}`)), t2.click && e2.addEventListener("click", t2.click.bind(this)), "prev" === t2.id && e2.setAttribute("data-fancybox-prev", ""), "next" === t2.id && e2.setAttribute("data-fancybox-next", "");
    const i2 = e2.querySelector("svg");
    return i2 && (i2.setAttribute("role", "img"), i2.setAttribute("tabindex", "-1"), i2.setAttribute("xmlns", "http://www.w3.org/2000/svg")), e2;
  }
  build() {
    this.cleanup();
    const i2 = this.fancybox.option("Toolbar.items"), s2 = [{ position: "left", items: [] }, { position: "center", items: [] }, { position: "right", items: [] }], o2 = this.fancybox.plugins.Thumbs;
    for (const n3 of this.fancybox.option("Toolbar.display")) {
      let a2, r2;
      if (t(n3) ? (a2 = n3.id, r2 = e({}, i2[a2], n3)) : (a2 = n3, r2 = i2[a2]), ["counter", "next", "prev", "slideshow"].includes(a2) && this.fancybox.items.length < 2)
        continue;
      if ("fullscreen" === a2) {
        if (!document.fullscreenEnabled || window.fullScreen)
          continue;
        document.addEventListener("fullscreenchange", this.onFsChange);
      }
      if ("thumbs" === a2 && (!o2 || "disabled" === o2.state))
        continue;
      if (!r2)
        continue;
      let h2 = r2.position || "right", l2 = s2.find((t2) => t2.position === h2);
      l2 && l2.items.push(r2);
    }
    const n2 = document.createElement("div");
    n2.classList.add("fancybox__toolbar");
    for (const t2 of s2)
      if (t2.items.length) {
        const e2 = document.createElement("div");
        e2.classList.add("fancybox__toolbar__items"), e2.classList.add(`fancybox__toolbar__items--${t2.position}`);
        for (const i3 of t2.items)
          e2.appendChild(this.createElement(i3));
        n2.appendChild(e2);
      }
    this.fancybox.$carousel.parentNode.insertBefore(n2, this.fancybox.$carousel), this.$container = n2;
  }
  update() {
    const t2 = this.fancybox.getSlide(), e2 = t2.index, i2 = this.fancybox.items.length, s2 = t2.downloadSrc || ("image" !== t2.type || t2.error ? null : t2.src);
    for (const t3 of this.fancybox.$container.querySelectorAll("a.fancybox__button--download"))
      s2 ? (t3.removeAttribute("disabled"), t3.removeAttribute("tabindex"), t3.setAttribute("href", s2), t3.setAttribute("download", s2), t3.setAttribute("target", "_blank")) : (t3.setAttribute("disabled", ""), t3.setAttribute("tabindex", -1), t3.removeAttribute("href"), t3.removeAttribute("download"));
    const o2 = t2.Panzoom, n2 = o2 && o2.option("maxScale") > o2.option("baseScale");
    for (const t3 of this.fancybox.$container.querySelectorAll(".fancybox__button--zoom"))
      n2 ? t3.removeAttribute("disabled") : t3.setAttribute("disabled", "");
    for (const e3 of this.fancybox.$container.querySelectorAll("[data-fancybox-index]"))
      e3.innerHTML = t2.index + 1;
    for (const t3 of this.fancybox.$container.querySelectorAll("[data-fancybox-count]"))
      t3.innerHTML = i2;
    if (!this.fancybox.option("infinite")) {
      for (const t3 of this.fancybox.$container.querySelectorAll("[data-fancybox-prev]"))
        0 === e2 ? t3.setAttribute("disabled", "") : t3.removeAttribute("disabled");
      for (const t3 of this.fancybox.$container.querySelectorAll("[data-fancybox-next]"))
        e2 === i2 - 1 ? t3.setAttribute("disabled", "") : t3.removeAttribute("disabled");
    }
  }
  cleanup() {
    this.Slideshow && this.Slideshow.isActive() && this.Slideshow.clearTimer(), this.$container && this.$container.remove(), this.$container = null;
  }
  attach() {
    this.fancybox.on(this.events);
  }
  detach() {
    this.fancybox.off(this.events), this.cleanup();
  }
}
k.defaults = z;
const O = { ScrollLock: class {
  constructor(t2) {
    this.fancybox = t2, this.viewport = null, this.pendingUpdate = null;
    for (const t3 of ["onReady", "onResize", "onTouchstart", "onTouchmove"])
      this[t3] = this[t3].bind(this);
  }
  onReady() {
    const t2 = window.visualViewport;
    t2 && (this.viewport = t2, this.startY = 0, t2.addEventListener("resize", this.onResize), this.updateViewport()), window.addEventListener("touchstart", this.onTouchstart, { passive: false }), window.addEventListener("touchmove", this.onTouchmove, { passive: false }), window.addEventListener("wheel", this.onWheel, { passive: false });
  }
  onResize() {
    this.updateViewport();
  }
  updateViewport() {
    const t2 = this.fancybox, e2 = this.viewport, i2 = e2.scale || 1, s2 = t2.$container;
    if (!s2)
      return;
    let o2 = "", n2 = "", a2 = "";
    i2 - 1 > 0.1 && (o2 = e2.width * i2 + "px", n2 = e2.height * i2 + "px", a2 = `translate3d(${e2.offsetLeft}px, ${e2.offsetTop}px, 0) scale(${1 / i2})`), s2.style.width = o2, s2.style.height = n2, s2.style.transform = a2;
  }
  onTouchstart(t2) {
    this.startY = t2.touches ? t2.touches[0].screenY : t2.screenY;
  }
  onTouchmove(t2) {
    const e2 = this.startY, i2 = window.innerWidth / window.document.documentElement.clientWidth;
    if (!t2.cancelable)
      return;
    if (t2.touches.length > 1 || 1 !== i2)
      return;
    const o2 = s(t2.composedPath()[0]);
    if (!o2)
      return void t2.preventDefault();
    const n2 = window.getComputedStyle(o2), a2 = parseInt(n2.getPropertyValue("height"), 10), r2 = t2.touches ? t2.touches[0].screenY : t2.screenY, h2 = e2 <= r2 && 0 === o2.scrollTop, l2 = e2 >= r2 && o2.scrollHeight - o2.scrollTop === a2;
    (h2 || l2) && t2.preventDefault();
  }
  onWheel(t2) {
    s(t2.composedPath()[0]) || t2.preventDefault();
  }
  cleanup() {
    this.pendingUpdate && (cancelAnimationFrame(this.pendingUpdate), this.pendingUpdate = null);
    const t2 = this.viewport;
    t2 && (t2.removeEventListener("resize", this.onResize), this.viewport = null), window.removeEventListener("touchstart", this.onTouchstart, false), window.removeEventListener("touchmove", this.onTouchmove, false), window.removeEventListener("wheel", this.onWheel, { passive: false });
  }
  attach() {
    this.fancybox.on("initLayout", this.onReady);
  }
  detach() {
    this.fancybox.off("initLayout", this.onReady), this.cleanup();
  }
}, Thumbs: C, Html: P, Toolbar: k, Image: T, Hash: L };
const M = { startIndex: 0, preload: 1, infinite: true, showClass: "fancybox-zoomInUp", hideClass: "fancybox-fadeOut", animated: true, hideScrollbar: true, parentEl: null, mainClass: null, autoFocus: true, trapFocus: true, placeFocusBack: true, click: "close", closeButton: "inside", dragToClose: true, keyboard: { Escape: "close", Delete: "close", Backspace: "close", PageUp: "next", PageDown: "prev", ArrowUp: "next", ArrowDown: "prev", ArrowRight: "next", ArrowLeft: "prev" }, template: { closeButton: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg>', spinner: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>', main: null }, l10n: { CLOSE: "Close", NEXT: "Next", PREV: "Previous", MODAL: "You can close this modal content with the ESC key", ERROR: "Something Went Wrong, Please Try Again Later", IMAGE_ERROR: "Image Not Found", ELEMENT_NOT_FOUND: "HTML Element Not Found", AJAX_NOT_FOUND: "Error Loading AJAX : Not Found", AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden", IFRAME_ERROR: "Error Loading Page", TOGGLE_ZOOM: "Toggle zoom level", TOGGLE_THUMBS: "Toggle thumbnails", TOGGLE_SLIDESHOW: "Toggle slideshow", TOGGLE_FULLSCREEN: "Toggle full-screen mode", DOWNLOAD: "Download" } }, I = /* @__PURE__ */ new Map();
let F = 0;
class R extends l {
  constructor(t2, i2 = {}) {
    t2 = t2.map((t3) => (t3.width && (t3._width = t3.width), t3.height && (t3._height = t3.height), t3)), super(e(true, {}, M, i2)), this.bindHandlers(), this.state = "init", this.setItems(t2), this.attachPlugins(R.Plugins), this.trigger("init"), true === this.option("hideScrollbar") && this.hideScrollbar(), this.initLayout(), this.initCarousel(), this.attachEvents(), I.set(this.id, this), this.trigger("prepare"), this.state = "ready", this.trigger("ready"), this.$container.setAttribute("aria-hidden", "false"), this.option("trapFocus") && this.focus();
  }
  option(t2, ...e2) {
    const i2 = this.getSlide();
    let s2 = i2 ? i2[t2] : void 0;
    return void 0 !== s2 ? ("function" == typeof s2 && (s2 = s2.call(this, this, ...e2)), s2) : super.option(t2, ...e2);
  }
  bindHandlers() {
    for (const t2 of ["onMousedown", "onKeydown", "onClick", "onFocus", "onCreateSlide", "onSettle", "onTouchMove", "onTouchEnd", "onTransform"])
      this[t2] = this[t2].bind(this);
  }
  attachEvents() {
    document.addEventListener("mousedown", this.onMousedown), document.addEventListener("keydown", this.onKeydown, true), this.option("trapFocus") && document.addEventListener("focus", this.onFocus, true), this.$container.addEventListener("click", this.onClick);
  }
  detachEvents() {
    document.removeEventListener("mousedown", this.onMousedown), document.removeEventListener("keydown", this.onKeydown, true), document.removeEventListener("focus", this.onFocus, true), this.$container.removeEventListener("click", this.onClick);
  }
  initLayout() {
    this.$root = this.option("parentEl") || document.body;
    let t2 = this.option("template.main");
    t2 && (this.$root.insertAdjacentHTML("beforeend", this.localize(t2)), this.$container = this.$root.querySelector(".fancybox__container")), this.$container || (this.$container = document.createElement("div"), this.$root.appendChild(this.$container)), this.$container.onscroll = () => (this.$container.scrollLeft = 0, false), Object.entries({ class: "fancybox__container", role: "dialog", tabIndex: "-1", "aria-modal": "true", "aria-hidden": "true", "aria-label": this.localize("{{MODAL}}") }).forEach((t3) => this.$container.setAttribute(...t3)), this.option("animated") && this.$container.classList.add("is-animated"), this.$backdrop = this.$container.querySelector(".fancybox__backdrop"), this.$backdrop || (this.$backdrop = document.createElement("div"), this.$backdrop.classList.add("fancybox__backdrop"), this.$container.appendChild(this.$backdrop)), this.$carousel = this.$container.querySelector(".fancybox__carousel"), this.$carousel || (this.$carousel = document.createElement("div"), this.$carousel.classList.add("fancybox__carousel"), this.$container.appendChild(this.$carousel)), this.$container.Fancybox = this, this.id = this.$container.getAttribute("id"), this.id || (this.id = this.options.id || ++F, this.$container.setAttribute("id", "fancybox-" + this.id));
    const e2 = this.option("mainClass");
    return e2 && this.$container.classList.add(...e2.split(" ")), document.documentElement.classList.add("with-fancybox"), this.trigger("initLayout"), this;
  }
  setItems(t2) {
    const e2 = [];
    for (const i2 of t2) {
      const t3 = i2.$trigger;
      if (t3) {
        const e3 = t3.dataset || {};
        i2.src = e3.src || t3.getAttribute("href") || i2.src, i2.type = e3.type || i2.type, !i2.src && t3 instanceof HTMLImageElement && (i2.src = t3.currentSrc || i2.$trigger.src);
      }
      let s2 = i2.$thumb;
      if (!s2) {
        let t4 = i2.$trigger && i2.$trigger.origTarget;
        t4 && (s2 = t4 instanceof HTMLImageElement ? t4 : t4.querySelector("img:not([aria-hidden])")), !s2 && i2.$trigger && (s2 = i2.$trigger instanceof HTMLImageElement ? i2.$trigger : i2.$trigger.querySelector("img:not([aria-hidden])"));
      }
      i2.$thumb = s2 || null;
      let o2 = i2.thumb;
      !o2 && s2 && (o2 = s2.currentSrc || s2.src, !o2 && s2.dataset && (o2 = s2.dataset.lazySrc || s2.dataset.src)), o2 || "image" !== i2.type || (o2 = i2.src), i2.thumb = o2 || null, i2.caption = i2.caption || "", e2.push(i2);
    }
    this.items = e2;
  }
  initCarousel() {
    return this.Carousel = new y(this.$carousel, e(true, {}, { prefix: "", classNames: { viewport: "fancybox__viewport", track: "fancybox__track", slide: "fancybox__slide" }, textSelection: true, preload: this.option("preload"), friction: 0.88, slides: this.items, initialPage: this.options.startIndex, slidesPerPage: 1, infiniteX: this.option("infinite"), infiniteY: true, l10n: this.option("l10n"), Dots: false, Navigation: { classNames: { main: "fancybox__nav", button: "carousel__button", next: "is-next", prev: "is-prev" } }, Panzoom: { textSelection: true, panOnlyZoomed: () => this.Carousel && this.Carousel.pages && this.Carousel.pages.length < 2 && !this.option("dragToClose"), lockAxis: () => {
      if (this.Carousel) {
        let t2 = "x";
        return this.option("dragToClose") && (t2 += "y"), t2;
      }
    } }, on: { "*": (t2, ...e2) => this.trigger(`Carousel.${t2}`, ...e2), init: (t2) => this.Carousel = t2, createSlide: this.onCreateSlide, settle: this.onSettle } }, this.option("Carousel"))), this.option("dragToClose") && this.Carousel.Panzoom.on({ touchMove: this.onTouchMove, afterTransform: this.onTransform, touchEnd: this.onTouchEnd }), this.trigger("initCarousel"), this;
  }
  onCreateSlide(t2, e2) {
    let i2 = e2.caption || "";
    if ("function" == typeof this.options.caption && (i2 = this.options.caption.call(this, this, this.Carousel, e2)), "string" == typeof i2 && i2.length) {
      const t3 = document.createElement("div"), s2 = `fancybox__caption_${this.id}_${e2.index}`;
      t3.className = "fancybox__caption", t3.innerHTML = i2, t3.setAttribute("id", s2), e2.$caption = e2.$el.appendChild(t3), e2.$el.classList.add("has-caption"), e2.$el.setAttribute("aria-labelledby", s2);
    }
  }
  onSettle() {
    this.option("autoFocus") && this.focus();
  }
  onFocus(t2) {
    this.isTopmost() && this.focus(t2);
  }
  onClick(t2) {
    if (t2.defaultPrevented)
      return;
    let e2 = t2.composedPath()[0];
    if (e2.matches("[data-fancybox-close]"))
      return t2.preventDefault(), void R.close(false, t2);
    if (e2.matches("[data-fancybox-next]"))
      return t2.preventDefault(), void R.next();
    if (e2.matches("[data-fancybox-prev]"))
      return t2.preventDefault(), void R.prev();
    const i2 = document.activeElement;
    if (i2) {
      if (i2.closest("[contenteditable]"))
        return;
      e2.matches(x) || i2.blur();
    }
    if (e2.closest(".fancybox__content"))
      return;
    if (getSelection().toString().length)
      return;
    if (false === this.trigger("click", t2))
      return;
    switch (this.option("click")) {
      case "close":
        this.close();
        break;
      case "next":
        this.next();
    }
  }
  onTouchMove() {
    const t2 = this.getSlide().Panzoom;
    return !t2 || 1 === t2.content.scale;
  }
  onTouchEnd(t2) {
    const e2 = t2.dragOffset.y;
    Math.abs(e2) >= 150 || Math.abs(e2) >= 35 && t2.dragOffset.time < 350 ? (this.option("hideClass") && (this.getSlide().hideClass = "fancybox-throwOut" + (t2.content.y < 0 ? "Up" : "Down")), this.close()) : "y" === t2.lockAxis && t2.panTo({ y: 0 });
  }
  onTransform(t2) {
    if (this.$backdrop) {
      const e2 = Math.abs(t2.content.y), i2 = e2 < 1 ? "" : Math.max(0.33, Math.min(1, 1 - e2 / t2.content.fitHeight * 1.5));
      this.$container.style.setProperty("--fancybox-ts", i2 ? "0s" : ""), this.$container.style.setProperty("--fancybox-opacity", i2);
    }
  }
  onMousedown() {
    "ready" === this.state && document.body.classList.add("is-using-mouse");
  }
  onKeydown(t2) {
    if (!this.isTopmost())
      return;
    document.body.classList.remove("is-using-mouse");
    const e2 = t2.key, i2 = this.option("keyboard");
    if (!i2 || t2.ctrlKey || t2.altKey || t2.shiftKey)
      return;
    const s2 = t2.composedPath()[0], o2 = document.activeElement && document.activeElement.classList, n2 = o2 && o2.contains("carousel__button");
    if ("Escape" !== e2 && !n2) {
      if (t2.target.isContentEditable || -1 !== ["BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(s2.nodeName))
        return;
    }
    if (false === this.trigger("keydown", e2, t2))
      return;
    const a2 = i2[e2];
    "function" == typeof this[a2] && this[a2]();
  }
  getSlide() {
    const t2 = this.Carousel;
    if (!t2)
      return null;
    const e2 = null === t2.page ? t2.option("initialPage") : t2.page, i2 = t2.pages || [];
    return i2.length && i2[e2] ? i2[e2].slides[0] : null;
  }
  focus(t2) {
    if (R.ignoreFocusChange)
      return;
    if (["init", "closing", "customClosing", "destroy"].indexOf(this.state) > -1)
      return;
    const e2 = this.$container, i2 = this.getSlide(), s2 = "done" === i2.state ? i2.$el : null;
    if (s2 && s2.contains(document.activeElement))
      return;
    t2 && t2.preventDefault(), R.ignoreFocusChange = true;
    const o2 = Array.from(e2.querySelectorAll(x));
    let n2, a2 = [];
    for (let t3 of o2) {
      const e3 = t3.offsetParent, i3 = s2 && s2.contains(t3), o3 = !this.Carousel.$viewport.contains(t3);
      e3 && (i3 || o3) ? (a2.push(t3), void 0 !== t3.dataset.origTabindex && (t3.tabIndex = t3.dataset.origTabindex, t3.removeAttribute("data-orig-tabindex")), (t3.hasAttribute("autoFocus") || !n2 && i3 && !t3.classList.contains("carousel__button")) && (n2 = t3)) : (t3.dataset.origTabindex = void 0 === t3.dataset.origTabindex ? t3.getAttribute("tabindex") : t3.dataset.origTabindex, t3.tabIndex = -1);
    }
    t2 ? a2.indexOf(t2.target) > -1 ? this.lastFocus = t2.target : this.lastFocus === e2 ? w(a2[a2.length - 1]) : w(e2) : this.option("autoFocus") && n2 ? w(n2) : a2.indexOf(document.activeElement) < 0 && w(e2), this.lastFocus = document.activeElement, R.ignoreFocusChange = false;
  }
  hideScrollbar() {
    if (!v)
      return;
    const t2 = window.innerWidth - document.documentElement.getBoundingClientRect().width, e2 = "fancybox-style-noscroll";
    let i2 = document.getElementById(e2);
    i2 || t2 > 0 && (i2 = document.createElement("style"), i2.id = e2, i2.type = "text/css", i2.innerHTML = `.compensate-for-scrollbar {padding-right: ${t2}px;}`, document.getElementsByTagName("head")[0].appendChild(i2), document.body.classList.add("compensate-for-scrollbar"));
  }
  revealScrollbar() {
    document.body.classList.remove("compensate-for-scrollbar");
    const t2 = document.getElementById("fancybox-style-noscroll");
    t2 && t2.remove();
  }
  clearContent(t2) {
    this.Carousel.trigger("removeSlide", t2), t2.$content && (t2.$content.remove(), t2.$content = null), t2.$closeButton && (t2.$closeButton.remove(), t2.$closeButton = null), t2._className && t2.$el.classList.remove(t2._className);
  }
  setContent(t2, e2, i2 = {}) {
    let s2;
    const o2 = t2.$el;
    if (e2 instanceof HTMLElement)
      ["img", "iframe", "video", "audio"].indexOf(e2.nodeName.toLowerCase()) > -1 ? (s2 = document.createElement("div"), s2.appendChild(e2)) : s2 = e2;
    else {
      const t3 = document.createRange().createContextualFragment(e2);
      s2 = document.createElement("div"), s2.appendChild(t3);
    }
    if (t2.filter && !t2.error && (s2 = s2.querySelector(t2.filter)), s2 instanceof Element)
      return t2._className = `has-${i2.suffix || t2.type || "unknown"}`, o2.classList.add(t2._className), s2.classList.add("fancybox__content"), "none" !== s2.style.display && "none" !== getComputedStyle(s2).getPropertyValue("display") || (s2.style.display = t2.display || this.option("defaultDisplay") || "flex"), t2.id && s2.setAttribute("id", t2.id), t2.$content = s2, o2.prepend(s2), this.manageCloseButton(t2), "loading" !== t2.state && this.revealContent(t2), s2;
    this.setError(t2, "{{ELEMENT_NOT_FOUND}}");
  }
  manageCloseButton(t2) {
    const e2 = void 0 === t2.closeButton ? this.option("closeButton") : t2.closeButton;
    if (!e2 || "top" === e2 && this.$closeButton)
      return;
    const i2 = document.createElement("button");
    i2.classList.add("carousel__button", "is-close"), i2.setAttribute("title", this.options.l10n.CLOSE), i2.innerHTML = this.option("template.closeButton"), i2.addEventListener("click", (t3) => this.close(t3)), "inside" === e2 ? (t2.$closeButton && t2.$closeButton.remove(), t2.$closeButton = t2.$content.appendChild(i2)) : this.$closeButton = this.$container.insertBefore(i2, this.$container.firstChild);
  }
  revealContent(t2) {
    this.trigger("reveal", t2), t2.$content.style.visibility = "";
    let e2 = false;
    t2.error || "loading" === t2.state || null !== this.Carousel.prevPage || t2.index !== this.options.startIndex || (e2 = void 0 === t2.showClass ? this.option("showClass") : t2.showClass), e2 ? (t2.state = "animating", this.animateCSS(t2.$content, e2, () => {
      this.done(t2);
    })) : this.done(t2);
  }
  animateCSS(t2, e2, i2) {
    if (t2 && t2.dispatchEvent(new CustomEvent("animationend", { bubbles: true, cancelable: true })), !t2 || !e2)
      return void ("function" == typeof i2 && i2());
    const s2 = function(o2) {
      o2.currentTarget === this && (t2.removeEventListener("animationend", s2), i2 && i2(), t2.classList.remove(e2));
    };
    t2.addEventListener("animationend", s2), t2.classList.add(e2);
  }
  done(t2) {
    t2.state = "done", this.trigger("done", t2);
    const e2 = this.getSlide();
    e2 && t2.index === e2.index && this.option("autoFocus") && this.focus();
  }
  setError(t2, e2) {
    t2.error = e2, this.hideLoading(t2), this.clearContent(t2);
    const i2 = document.createElement("div");
    i2.classList.add("fancybox-error"), i2.innerHTML = this.localize(e2 || "<p>{{ERROR}}</p>"), this.setContent(t2, i2, { suffix: "error" });
  }
  showLoading(t2) {
    t2.state = "loading", t2.$el.classList.add("is-loading");
    let e2 = t2.$el.querySelector(".fancybox__spinner");
    e2 || (e2 = document.createElement("div"), e2.classList.add("fancybox__spinner"), e2.innerHTML = this.option("template.spinner"), e2.addEventListener("click", () => {
      this.Carousel.Panzoom.velocity || this.close();
    }), t2.$el.prepend(e2));
  }
  hideLoading(t2) {
    const e2 = t2.$el && t2.$el.querySelector(".fancybox__spinner");
    e2 && (e2.remove(), t2.$el.classList.remove("is-loading")), "loading" === t2.state && (this.trigger("load", t2), t2.state = "ready");
  }
  next() {
    const t2 = this.Carousel;
    t2 && t2.pages.length > 1 && t2.slideNext();
  }
  prev() {
    const t2 = this.Carousel;
    t2 && t2.pages.length > 1 && t2.slidePrev();
  }
  jumpTo(...t2) {
    this.Carousel && this.Carousel.slideTo(...t2);
  }
  isClosing() {
    return ["closing", "customClosing", "destroy"].includes(this.state);
  }
  isTopmost() {
    return R.getInstance().id == this.id;
  }
  close(t2) {
    if (t2 && t2.preventDefault(), this.isClosing())
      return;
    if (false === this.trigger("shouldClose", t2))
      return;
    if (this.state = "closing", this.Carousel.Panzoom.destroy(), this.detachEvents(), this.trigger("closing", t2), "destroy" === this.state)
      return;
    this.$container.setAttribute("aria-hidden", "true"), this.$container.classList.add("is-closing");
    const e2 = this.getSlide();
    if (this.Carousel.slides.forEach((t3) => {
      t3.$content && t3.index !== e2.index && this.Carousel.trigger("removeSlide", t3);
    }), "closing" === this.state) {
      const t3 = void 0 === e2.hideClass ? this.option("hideClass") : e2.hideClass;
      this.animateCSS(e2.$content, t3, () => {
        this.destroy();
      }, true);
    }
  }
  destroy() {
    if ("destroy" === this.state)
      return;
    this.state = "destroy", this.trigger("destroy");
    const t2 = this.option("placeFocusBack") ? this.option("triggerTarget", this.getSlide().$trigger) : null;
    this.Carousel.destroy(), this.detachPlugins(), this.Carousel = null, this.options = {}, this.events = {}, this.$container.remove(), this.$container = this.$backdrop = this.$carousel = null, t2 && w(t2), I.delete(this.id);
    const e2 = R.getInstance();
    e2 ? e2.focus() : (document.documentElement.classList.remove("with-fancybox"), document.body.classList.remove("is-using-mouse"), this.revealScrollbar());
  }
  static show(t2, e2 = {}) {
    return new R(t2, e2);
  }
  static fromEvent(t2, e2 = {}) {
    if (t2.defaultPrevented)
      return;
    if (t2.button && 0 !== t2.button)
      return;
    if (t2.ctrlKey || t2.metaKey || t2.shiftKey)
      return;
    const i2 = t2.composedPath()[0];
    let s2, o2, n2, a2 = i2;
    if ((a2.matches("[data-fancybox-trigger]") || (a2 = a2.closest("[data-fancybox-trigger]"))) && (e2.triggerTarget = a2, s2 = a2 && a2.dataset && a2.dataset.fancyboxTrigger), s2) {
      const t3 = document.querySelectorAll(`[data-fancybox="${s2}"]`), e3 = parseInt(a2.dataset.fancyboxIndex, 10) || 0;
      a2 = t3.length ? t3[e3] : a2;
    }
    Array.from(R.openers.keys()).reverse().some((e3) => {
      n2 = a2 || i2;
      let s3 = false;
      try {
        n2 instanceof Element && ("string" == typeof e3 || e3 instanceof String) && (s3 = n2.matches(e3) || (n2 = n2.closest(e3)));
      } catch (t3) {
      }
      return !!s3 && (t2.preventDefault(), o2 = e3, true);
    });
    let r2 = false;
    if (o2) {
      e2.event = t2, e2.target = n2, n2.origTarget = i2, r2 = R.fromOpener(o2, e2);
      const s3 = R.getInstance();
      s3 && "ready" === s3.state && t2.detail && document.body.classList.add("is-using-mouse");
    }
    return r2;
  }
  static fromOpener(t2, i2 = {}) {
    let s2 = [], o2 = i2.startIndex || 0, n2 = i2.target || null;
    const a2 = void 0 !== (i2 = e({}, i2, R.openers.get(t2))).groupAll && i2.groupAll, r2 = void 0 === i2.groupAttr ? "data-fancybox" : i2.groupAttr, h2 = r2 && n2 ? n2.getAttribute(`${r2}`) : "";
    if (!n2 || h2 || a2) {
      const e2 = i2.root || (n2 ? n2.getRootNode() : document.body);
      s2 = [].slice.call(e2.querySelectorAll(t2));
    }
    if (n2 && !a2 && (s2 = h2 ? s2.filter((t3) => t3.getAttribute(`${r2}`) === h2) : [n2]), !s2.length)
      return false;
    const l2 = R.getInstance();
    return !(l2 && s2.indexOf(l2.options.$trigger) > -1) && (o2 = n2 ? s2.indexOf(n2) : o2, s2 = s2.map(function(t3) {
      const e2 = ["false", "0", "no", "null", "undefined"], i3 = ["true", "1", "yes"], s3 = Object.assign({}, t3.dataset), o3 = {};
      for (let [t4, n3] of Object.entries(s3))
        if ("fancybox" !== t4)
          if ("width" === t4 || "height" === t4)
            o3[`_${t4}`] = n3;
          else if ("string" == typeof n3 || n3 instanceof String)
            if (e2.indexOf(n3) > -1)
              o3[t4] = false;
            else if (i3.indexOf(o3[t4]) > -1)
              o3[t4] = true;
            else
              try {
                o3[t4] = JSON.parse(n3);
              } catch (e3) {
                o3[t4] = n3;
              }
          else
            o3[t4] = n3;
      return t3 instanceof Element && (o3.$trigger = t3), o3;
    }), new R(s2, e({}, i2, { startIndex: o2, $trigger: n2 })));
  }
  static bind(t2, e2 = {}) {
    function i2() {
      document.body.addEventListener("click", R.fromEvent, false);
    }
    v && (R.openers.size || (/complete|interactive|loaded/.test(document.readyState) ? i2() : document.addEventListener("DOMContentLoaded", i2)), R.openers.set(t2, e2));
  }
  static unbind(t2) {
    R.openers.delete(t2), R.openers.size || R.destroy();
  }
  static destroy() {
    let t2;
    for (; t2 = R.getInstance(); )
      t2.destroy();
    R.openers = /* @__PURE__ */ new Map(), document.body.removeEventListener("click", R.fromEvent, false);
  }
  static getInstance(t2) {
    if (t2)
      return I.get(t2);
    return Array.from(I.values()).reverse().find((t3) => !t3.isClosing() && t3) || null;
  }
  static close(t2 = true, e2) {
    if (t2)
      for (const t3 of I.values())
        t3.close(e2);
    else {
      const t3 = R.getInstance();
      t3 && t3.close(e2);
    }
  }
  static next() {
    const t2 = R.getInstance();
    t2 && t2.next();
  }
  static prev() {
    const t2 = R.getInstance();
    t2 && t2.prev();
  }
}
R.version = "4.0.31", R.defaults = M, R.openers = /* @__PURE__ */ new Map(), R.Plugins = O, R.bind("[data-fancybox]");
for (const [t2, e2] of Object.entries(R.Plugins || {}))
  "function" == typeof e2.create && e2.create(R);
export {
  Autoplay as A,
  EmblaCarousel as E,
  R
};
