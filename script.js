var Color;
(function (Color) {
    Color["Red"] = "229, 57, 53";
    Color["Orange"] = "255, 152, 0";
    Color["Yellow"] = "253, 216, 53";
    Color["Green"] = "76, 175, 80";
    Color["Blue"] = "30, 136, 229";
    Color["Purple"] = "123, 31, 162";
    Color["White"] = "255, 255, 255";
})(Color || (Color = {}));
var Vertical;
(function (Vertical) {
    Vertical["Up"] = "Up";
    Vertical["Down"] = "Down";
})(Vertical || (Vertical = {}));
var Lateral;
(function (Lateral) {
    Lateral["Left"] = "Left";
    Lateral["Right"] = "Right";
    Lateral["None"] = "";
})(Lateral || (Lateral = {}));
var ContextMenuActionLabel;
(function (ContextMenuActionLabel) {
    ContextMenuActionLabel["Infinite"] = "Infinite";
})(ContextMenuActionLabel || (ContextMenuActionLabel = {}));
var CanvasContextMenuWindowSize;
(function (CanvasContextMenuWindowSize) {
    CanvasContextMenuWindowSize[CanvasContextMenuWindowSize["Height"] = 302] = "Height";
    CanvasContextMenuWindowSize[CanvasContextMenuWindowSize["Width"] = 340] = "Width";
})(CanvasContextMenuWindowSize || (CanvasContextMenuWindowSize = {}));
const N = {
    rand: (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
};
const InfiniteContextMenuDirectionUtility = {
    determineDirection: (actionID, history, extensionRef, windowRef) => {
        const previousDirection = history[history.length - 1];
        return {
            id: Math.random().toString(),
            actionID,
            lateral: InfiniteContextMenuDirectionUtility.validateLateralMovement(previousDirection.lateral, extensionRef, windowRef),
            vertical: InfiniteContextMenuDirectionUtility.validateVerticalMovement(previousDirection.vertical, extensionRef, windowRef)
        };
    },
    validateLateralMovement: (lateral, extensionRef, windowRef) => {
        if (extensionRef.current !== null &&
            windowRef.current !== null) {
            const extensionRect = extensionRef.current.getBoundingClientRect();
            const tooFarRight = extensionRect.right + windowRef.current.clientWidth > window.innerWidth - 10, tooFarLeft = extensionRect.left - windowRef.current.clientWidth < 10;
            if (tooFarLeft && tooFarRight) {
                return Lateral.None;
            }
            else if (lateral === Lateral.Right && tooFarRight) {
                return Lateral.Left;
            }
            else if (lateral === Lateral.Left && tooFarLeft) {
                return Lateral.Right;
            }
        }
        return lateral;
    },
    validateVerticalMovement: (vertical, extensionRef, windowRef) => {
        if (extensionRef.current !== null &&
            windowRef.current !== null) {
            const extensionRect = extensionRef.current.getBoundingClientRect();
            if (vertical === Vertical.Down && extensionRect.top + windowRef.current.clientHeight - 10 > window.innerHeight - 10) {
                return Vertical.Up;
            }
            else if (vertical === Vertical.Up && (extensionRect.bottom + 10) - windowRef.current.clientHeight < 10) {
                return Vertical.Down;
            }
        }
        return vertical;
    }
};
const ContextMenuDirectionUtility = {
    determineDirection: (action, history, extensionRef, windowRef) => {
        if (action.label === ContextMenuActionLabel.Infinite && history.length > 0) {
            return InfiniteContextMenuDirectionUtility.determineDirection(action.id, history, extensionRef, windowRef);
        }
        return ContextMenuDirectionUtility.determineStandardDirection(action.id, extensionRef, windowRef);
    },
    determineStandardDirection: (actionID, extensionRef, windowRef) => {
        const entry = {
            id: Math.random().toString(),
            actionID,
            lateral: Lateral.Right,
            vertical: Vertical.Down
        };
        if (extensionRef.current !== null &&
            windowRef.current !== null) {
            const extensionRect = extensionRef.current.getBoundingClientRect();
            const tooFarRight = extensionRect.right + windowRef.current.clientWidth > window.innerWidth - 10, tooFarLeft = extensionRect.left - windowRef.current.clientWidth < 10;
            if (tooFarRight && tooFarLeft) {
                entry.lateral = Lateral.None;
            }
            else if (tooFarRight) {
                entry.lateral = Lateral.Left;
            }
            else if (tooFarLeft) {
                entry.lateral = Lateral.Right;
            }
            if (extensionRect.top + windowRef.current.clientHeight - 10 > window.innerHeight - 10) {
                entry.vertical = Vertical.Up;
            }
        }
        return entry;
    }
};
const InfiniteContextMenuUtility = {
    getActionLabel: (level) => {
        switch (level) {
            case 0:
                return "More options";
            case 1:
                return "Even more options";
            case 2:
                return "Extra options";
            case 3:
                return "Admin options";
            case 4:
                return "Super admin options";
            case 5:
                return "CEO options";
            case 6:
                return "Presidential options";
            case 7:
                return "World leader options";
            case 8:
                return "Galactic commander options";
            case 9:
                return "UNIVERSAL CONQUERER OPTIONS";
            case 10:
                return "There are no more options";
            case 11:
                return "No srsly";
            case 12:
                return "Pls turn back";
            case 13:
                return "C'mon now, I asked nicely";
            case 14:
                return "FINAL WARNING";
            default:
                return "ಠ_ಠ";
        }
    },
    getDefaultAction: () => {
        return {
            id: Math.random().toString(),
            label: ContextMenuActionLabel.Infinite,
            icon: "fa-solid fa-infinity"
        };
    },
    getEffectColor: (level, index) => {
        switch (level) {
            case 4:
                return Color.Green;
            case 5:
                return Color.Red;
            case 6:
                if (index % 3 === 0) {
                    return Color.Blue;
                }
                else if (index % 2 === 0) {
                    return Color.Red;
                }
                return Color.White;
            case 7:
                if (index % 3 === 0) {
                    return Color.Blue;
                }
                else if (index % 2 === 0) {
                    return Color.Green;
                }
                return Color.White;
            case 8:
                if (index % 3 === 0) {
                    return Color.Purple;
                }
                else if (index % 2 === 0) {
                    return Color.Blue;
                }
                return Color.White;
            case 9:
                if (index % 7 === 0) {
                    return Color.White;
                }
                else if (index % 6 === 0) {
                    return Color.Purple;
                }
                else if (index % 5 === 0) {
                    return Color.Blue;
                }
                else if (index % 4 === 0) {
                    return Color.Green;
                }
                else if (index % 3 === 0) {
                    return Color.Yellow;
                }
                else if (index % 2 === 0) {
                    return Color.Orange;
                }
                return Color.Red;
            case 10:
                return Color.Blue;
            case 11:
                return Color.Yellow;
            case 12:
                return Color.Orange;
            case 13:
            case 14:
            case 15:
                return Color.Red;
            default:
                return Color.Blue;
        }
    },
    getEffectIcon: (level) => {
        switch (level) {
            case 4:
                return "fa-solid fa-user-crown";
            case 5:
                return "fa-solid fa-user-tie";
            case 6:
                return "fa-duotone fa-flag-usa";
            case 7:
                return "fa-duotone fa-earth-americas";
            case 8:
                return "fa-duotone fa-galaxy";
            case 9:
                return "fa-solid fa-infinity";
            case 10:
                return "fa-solid fa-circle-exclamation";
            case 11:
                return "fa-solid fa-diamond-exclamation";
            case 12:
                return "fa-solid fa-siren";
            case 13:
                return "fa-solid fa-siren-on";
            case 14:
            case 15:
                return "fa-solid fa-skull-crossbones";
            default:
                return "fa-solid fa-user";
        }
    },
    getMenuSections: () => {
        return [
            ContextMenuUtility.mapSection([
                ContextMenuUtility.mapAction("New Item", "fa-solid fa-plus"),
                ContextMenuUtility.mapAction("Rename", "fa-solid fa-pen")
            ]),
            ContextMenuUtility.mapSection([
                ContextMenuUtility.mapAction("Favorite", "fa-solid fa-heart"),
                ContextMenuUtility.mapAction("Dislike", "fa-solid fa-thumbs-down")
            ]),
            ContextMenuUtility.mapSection([
                InfiniteContextMenuUtility.getDefaultAction()
            ])
        ];
    },
    getWindowLevelID: (level) => {
        return `infinite-context-menu-window-level-${level}`;
    },
    mapAction: (action) => {
        return Object.assign(Object.assign({}, action), { sections: InfiniteContextMenuUtility.getMenuSections() });
    }
};
const ContextMenuUtility = {
    determinePositionFromDirection: (entry) => {
        const position = {};
        if (entry) {
            if (entry.lateral === Lateral.None) {
                position.left = "-10px";
                if (entry.vertical === Vertical.Down) {
                    position.top = "100%";
                }
                else {
                    position.bottom = "100%";
                }
            }
            else {
                if (entry.lateral === Lateral.Right) {
                    position.left = "100%";
                }
                else if (entry.lateral === Lateral.Left) {
                    position.right = "100%";
                }
                if (entry.vertical === Vertical.Down) {
                    position.top = "-10px";
                }
                else {
                    position.bottom = "-10px";
                }
            }
        }
        return position;
    },
    determineMountPosition: (ref, position) => {
        const mountPosition = {};
        if (ref.current !== null) {
            const rect = ref.current.getBoundingClientRect();
            const { left, top } = position;
            if (left + rect.width > window.innerWidth) {
                mountPosition.right = `${Math.max(window.innerWidth - left, 10)}px`;
            }
            else {
                mountPosition.left = `${Math.max(left, 10)}px`;
            }
            if (top + rect.height > window.innerHeight) {
                mountPosition.bottom = `${Math.max(window.innerHeight - top, 10)}px`;
            }
            else {
                mountPosition.top = `${Math.max(top, 10)}px`;
            }
        }
        return mountPosition;
    },
    getActionDisplayLabel: (label, level) => {
        if (label === ContextMenuActionLabel.Infinite) {
            return InfiniteContextMenuUtility.getActionLabel(level);
        }
        return label;
    },
    getDirectionEntry: (action, directionHistory) => {
        if (action && directionHistory.length > 0) {
            return directionHistory.find((entry) => entry.actionID === action.id);
        }
        return null;
    },
    getPositionFromDirectionEntry: (action, directionHistory) => {
        const entry = ContextMenuUtility.getDirectionEntry(action, directionHistory);
        return ContextMenuUtility.determinePositionFromDirection(entry);
    },
    mapAction: (label, icon, className, onClick, sections) => {
        const action = {
            id: Math.random().toString(),
            label,
            icon
        };
        if (className) {
            action.className = className;
        }
        if (onClick) {
            action.onClick = onClick;
        }
        if (sections) {
            action.sections = sections;
        }
        return action;
    },
    mapSection: (actions) => {
        return {
            actions,
            id: Math.random().toString()
        };
    },
    shouldActivate: (ref, e) => {
        return (ref === null ||
            ref.current === null ||
            !ref.current.contains(e.target));
    },
    shouldDectivate: (ref, e) => {
        return (ref !== null &&
            ref.current !== null &&
            !ref.current.contains(e.target));
    }
};
const ContextMenuTestUtility = {
    getMenuSections: () => {
        const settingsSections = [
            ContextMenuUtility.mapSection([
                ContextMenuUtility.mapAction("Photo", "fa-solid fa-camera"),
                ContextMenuUtility.mapAction("Description", "fa-solid fa-align-left")
            ]),
            ContextMenuUtility.mapSection([
                ContextMenuUtility.mapAction("Stats", "fa-solid fa-chart-line")
            ])
        ];
        return [
            ContextMenuUtility.mapSection([
                ContextMenuUtility.mapAction("New Item", "fa-solid fa-plus"),
                ContextMenuUtility.mapAction("Rename", "fa-solid fa-pen")
            ]),
            ContextMenuUtility.mapSection([
                ContextMenuUtility.mapAction("Favorite", "fa-solid fa-heart"),
                ContextMenuUtility.mapAction("Dislike", "fa-solid fa-thumbs-down")
            ]),
            ContextMenuUtility.mapSection([
                ContextMenuUtility.mapAction("Settings", "fa-solid fa-gear", null, null, settingsSections),
                ContextMenuUtility.mapAction("Delete", "fa-solid fa-trash")
            ]),
            ContextMenuUtility.mapSection([
                InfiniteContextMenuUtility.getDefaultAction()
            ])
        ];
    }
};
const CanvasUtility = {
    getAnimatedValue: (initial, final, duration, timestamp) => {
        const percent = CanvasUtility.getAnimationPercent(duration, timestamp);
        if (percent >= 1 || initial === final)
            return final;
        const diff = final - initial;
        return initial + (diff * percent);
    },
    drawCanvas: (context) => {
        const height = context.canvas.clientHeight, width = context.canvas.clientWidth;
        context.canvas.height = height;
        context.canvas.width = width;
    },
    getAnimationPercent: (duration, timestamp) => {
        if (timestamp === null)
            return 1;
        const now = new Date().getTime(), diff = now - timestamp;
        return diff / duration;
    }
};
const ReticleUtility = {
    draw: (context, coordinate, clickAt) => {
        context.lineWidth = 3;
        context.lineCap = "round";
        const radius = 40, white = `rgba(${Color.White}, ${CanvasUtility.getAnimatedValue(0, 100, 250, clickAt) / 100})`;
        for (let i = 0.08; i < 2; i += 0.5) {
            context.beginPath();
            context.strokeStyle = `rgb(${Color.Blue})`;
            context.arc(coordinate.x, coordinate.y, radius, Math.PI * i, Math.PI * (0.34 + i));
            context.stroke();
        }
        for (let i = 0.1; i < 2; i += 0.5) {
            context.beginPath();
            context.strokeStyle = white;
            context.arc(coordinate.x, coordinate.y, CanvasUtility.getAnimatedValue(radius * 1.5, radius * 0.75, 250, clickAt), Math.PI * i, Math.PI * (0.3 + i));
            context.stroke();
        }
        context.beginPath();
        const length = CanvasUtility.getAnimatedValue(radius * 1.25, radius * 1.5, 250, clickAt);
        context.strokeStyle = `rgb(${Color.Blue})`;
        context.moveTo(coordinate.x, coordinate.y - 10);
        context.lineTo(coordinate.x, coordinate.y - length);
        context.moveTo(coordinate.x + 10, coordinate.y);
        context.lineTo(coordinate.x + length, coordinate.y);
        context.moveTo(coordinate.x, coordinate.y + 10);
        context.lineTo(coordinate.x, coordinate.y + length);
        context.moveTo(coordinate.x - 10, coordinate.y);
        context.lineTo(coordinate.x - length, coordinate.y);
        context.stroke();
        context.beginPath();
        context.fillStyle = white;
        context.arc(coordinate.x, coordinate.y, 2, 0, Math.PI * 2);
        context.fill();
    }
};
const WindowUtility = {
    create: (context, index) => {
        const speed = {
            x: index % 2 === 0 ? 1 : -1,
            y: index % 2 === 0 ? 1 : -1
        };
        const origin = {
            x: context.canvas.width / 2,
            y: index % 2 === 0 ? CanvasContextMenuWindowSize.Height * -1 : context.canvas.height + CanvasContextMenuWindowSize.Height
        };
        return {
            id: Math.random().toString(),
            coordinate: Object.assign({}, origin),
            speed: Object.assign({}, speed),
            destroyedAt: null
        };
    },
    determineSpeed: (context, coordinate, height, width, speed) => {
        const updated = Object.assign({}, speed);
        if (updated.x > 0 && coordinate.x + (width / 2) >= context.canvas.width) {
            updated.x = speed.x * -1;
        }
        else if (updated.x < 0 && coordinate.x - (width / 2) <= 0) {
            updated.x = speed.x * -1;
        }
        if (updated.y > 0 && coordinate.y + (height / 2) >= context.canvas.height) {
            updated.y = speed.y * -1;
        }
        else if (updated.y < 0 && coordinate.y - (height / 2) <= 0) {
            updated.y = speed.y * -1;
        }
        return updated;
    },
    drawImage: (context, img, w, clickAt, mouse) => {
        if (img) {
            const size = {
                height: w.destroyedAt ? CanvasUtility.getAnimatedValue(CanvasContextMenuWindowSize.Height, CanvasContextMenuWindowSize.Height * 1.5, 100, w.destroyedAt) : CanvasContextMenuWindowSize.Height,
                width: w.destroyedAt ? CanvasUtility.getAnimatedValue(CanvasContextMenuWindowSize.Width, CanvasContextMenuWindowSize.Width * 1.5, 100, w.destroyedAt) : CanvasContextMenuWindowSize.Width
            };
            w.coordinate.x = w.coordinate.x + w.speed.x;
            w.coordinate.y = w.coordinate.y + w.speed.y;
            w.speed = WindowUtility.determineSpeed(context, w.coordinate, size.height, size.width, w.speed);
            const upperLeft = {
                x: w.coordinate.x - (size.width / 2),
                y: w.coordinate.y - (size.height / 2)
            };
            context.shadowBlur = 29;
            context.shadowColor = "rgba(10, 10, 10, 0.5)";
            context.shadowOffsetY = 7;
            if (w.destroyedAt) {
                context.fillStyle = `rgba(20, 20, 20, ${CanvasUtility.getAnimatedValue(100, 0, 100, w.destroyedAt) / 100})`;
                context.fillRect(upperLeft.x, upperLeft.y, size.width, size.height);
            }
            else {
                context.drawImage(img, upperLeft.x, upperLeft.y, size.width, size.height);
            }
            if (WindowUtility.isClickInWindow(upperLeft, size, mouse)) {
                const now = new Date().getTime();
                if (now - clickAt <= 10 && w.destroyedAt === null) {
                    w.destroyedAt = now;
                }
            }
        }
    },
    drawAll: (context, img, windows, clickAt, mouse) => {
        for (let w of windows) {
            WindowUtility.drawImage(context, img, w, clickAt, mouse);
        }
    },
    filterOutDestroyed: (windows, clickAt) => {
        const now = new Date().getTime();
        if (clickAt && now - clickAt < 500) {
            return windows.filter((w) => w.destroyedAt === null || now - w.destroyedAt <= 100);
        }
        return windows;
    },
    isClickInWindow: (start, size, mouse) => {
        return (mouse.x >= start.x &&
            mouse.x <= start.x + size.width &&
            mouse.y >= start.y &&
            mouse.y <= start.y + size.height);
    }
};
const NoMoreOptionsText = () => {
    const getText = () => {
        return Array.from(Array(5)).map((x, i) => {
            const animationDelay = `${1000 * i}ms`;
            return (React.createElement("span", { key: i, className: "rubik-font", style: { animationDelay } }, "There are no more options"));
        });
    };
    return (React.createElement("div", { id: "no-more-options-text" }, getText()));
};
const InfiniteCanvas = () => {
    const ref = React.useRef(null), imageRef = React.useRef(null);
    React.useEffect(() => {
        if (ref.current) {
            const context = ref.current.getContext("2d");
            context.canvas.height = context.canvas.clientHeight;
            context.canvas.width = context.canvas.clientWidth;
            let clickAt = null;
            const mouse = {
                x: context.canvas.width / 2,
                y: context.canvas.height / 2
            };
            let index = 0, windows = [WindowUtility.create(context, index++)];
            const generate = () => {
                setTimeout(() => {
                    if (windows.length < 100) {
                        windows.push(WindowUtility.create(context, index++));
                    }
                    window.requestAnimationFrame(generate);
                }, 600);
            };
            const draw = () => {
                CanvasUtility.drawCanvas(context);
                windows = WindowUtility.filterOutDestroyed(windows, clickAt);
                WindowUtility.drawAll(context, imageRef.current, windows, clickAt, mouse);
                ReticleUtility.draw(context, mouse, clickAt);
                window.requestAnimationFrame(draw);
            };
            draw();
            generate();
            const handleOnMouseMove = (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            };
            const handleOnResize = (e) => {
                if (windows.length > 0) {
                    windows = [];
                }
            };
            const handleOnClick = (e) => {
                clickAt = new Date().getTime();
            };
            ref.current.addEventListener("mousemove", handleOnMouseMove);
            window.addEventListener("resize", handleOnResize);
            ref.current.addEventListener("mousedown", handleOnClick);
            return () => {
                window.removeEventListener("resize", handleOnResize);
            };
        }
    }, []);
    return (React.createElement("canvas", { ref: ref, id: "infinite-canvas" },
        React.createElement("img", { ref: imageRef, src: "https://assets.codepen.io/1468070/infinite-menu-options.png", height: "100", width: "100" })));
};
const WindowEffectIcon = (props) => {
    const delay = props.index * 250;
    const getRandomPositionOnSide = (side) => {
        if (side === 0) {
            return {
                left: `${N.rand(10, 90)}%`,
                top: `${N.rand(0, 30) * -1}px`
            };
        }
        else if (side === 1) {
            return {
                right: `${N.rand(0, 30) * -1}px`,
                top: `${N.rand(10, 90)}%`
            };
        }
        else if (side === 2) {
            return {
                left: `${N.rand(10, 90)}%`,
                bottom: `${N.rand(0, 30) * -1}px`
            };
        }
        else if (side === 3) {
            return {
                left: `${N.rand(0, 30) * -1}px`,
                top: `${N.rand(10, 90)}%`
            };
        }
    };
    const [position, setPositionTo] = React.useState(getRandomPositionOnSide(N.rand(0, 3)));
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setPositionTo(getRandomPositionOnSide(N.rand(0, 3)));
        }, props.duration + delay);
        return () => clearTimeout(timeout);
    }, [position]);
    const getStyles = () => {
        return Object.assign(Object.assign({}, position), { animationDelay: `${delay}ms`, animationDuration: `${props.duration}ms`, color: `rgb(${props.color})` });
    };
    const key = `${position.left}${position.top}`;
    return (React.createElement("i", { key: key, className: props.icon, style: getStyles() }));
};
const WindowEffect = (props) => {
    const getIcons = () => {
        return Array.from(Array(16)).map((x, index) => {
            return (React.createElement(WindowEffectIcon, { key: index, icon: InfiniteContextMenuUtility.getEffectIcon(props.level), duration: props.duration, index: index, color: InfiniteContextMenuUtility.getEffectColor(props.level, index) }));
        });
    };
    return (React.createElement("div", { className: "window-effect" }, getIcons()));
};
const SparkleIcon = (props) => {
    const delay = props.index * 250;
    const getRandomPosition = () => ({
        left: `${N.rand(10, 90)}%`,
        top: `${N.rand(20, 80)}%`
    });
    const [position, setPositionTo] = React.useState(getRandomPosition());
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setPositionTo(getRandomPosition());
        }, props.duration + delay);
        return () => clearTimeout(timeout);
    }, [position]);
    const getStyles = () => {
        return {
            animationDelay: `${delay}ms`,
            animationDuration: `${props.duration}ms`,
            color: `rgb(${props.color})`,
            left: position.left,
            top: position.top
        };
    };
    const key = `${position.left}${position.top}`;
    return (React.createElement("i", { key: key, className: props.icon, style: getStyles() }));
};
export const WaveEffect = (props) => {
    const getStyles = (index) => {
        return {
            animationDelay: `${index * 200 * -1}ms`,
            animationDuration: `${props.duration}ms`,
            color: `rgb(${InfiniteContextMenuUtility.getEffectColor(props.level, index)})`,
            left: `${index * 30}px`
        };
    };
    const getIcons = () => {
        return Array.from(Array(10)).map((x, index) => {
            return (React.createElement("i", { key: index, className: InfiniteContextMenuUtility.getEffectIcon(props.level), style: getStyles(index) }));
        });
    };
    const getEscalationLevel = () => {
        if (props.level <= 5 || props.level === 10) {
            return 0;
        }
        else if (props.level === 6 || props.level === 7 || (props.level >= 11 && props.level <= 13)) {
            return 1;
        }
        else if (props.level === 8) {
            return 2;
        }
        else if (props.level === 9 || props.level === 14) {
            return 3;
        }
        return 0;
    };
    const escalationLevelClass = `escalation-level-${getEscalationLevel()}`;
    return (React.createElement("div", { className: classNames("wave-effect", escalationLevelClass) }, getIcons()));
};
const SparkleEffect = (props) => {
    const getIcon = () => {
        switch (props.level) {
            default:
                return "fa-solid fa-star-sharp";
        }
    };
    const getColor = () => {
        switch (props.level) {
            case 1:
                return Color.Green;
            case 2:
                return Color.Purple;
            default:
                return Color.Blue;
        }
    };
    const getIcons = () => {
        return Array.from(Array(8)).map((x, index) => {
            return (React.createElement(SparkleIcon, { key: index, icon: getIcon(), duration: props.duration, index: index, color: getColor() }));
        });
    };
    return (React.createElement("div", { className: "sparkle-effect" }, getIcons()));
};
const SpecialEffect = (props) => {
    const getSpecialEffect = () => {
        switch (props.level) {
            case 0:
            case 1:
            case 2:
                return (React.createElement(SparkleEffect, { level: props.level, duration: 1500 }));
            default:
                return (React.createElement(WaveEffect, { level: props.level, duration: 4000 }));
        }
    };
    return (React.createElement("div", { className: "special-effect" }, getSpecialEffect()));
};
const ContextMenuAction = (props) => {
    return (React.createElement("button", { type: "button", className: classNames("context-menu-action", props.className), onClick: props.onClick },
        React.createElement("i", { className: props.icon }),
        React.createElement("span", { className: "label rubik-font" }, props.label),
        props.effect || null));
};
const ContextMenuExtension = (props) => {
    const { state, truncateDirectionHistoryAtEntry } = React.useContext(ContextMenuContext);
    const [active, setActiveTo] = React.useState(false), [deactivate, setDeactivateTo] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (props.level === 0 && state.branchID !== props.action.id) {
            setActiveTo(false);
        }
    }, [state.directionHistory]);
    React.useEffect(() => {
        if (deactivate) {
            const timeout = setTimeout(() => {
                truncateDirectionHistoryAtEntry(props.action.id);
                setActiveTo(false);
                setDeactivateTo(false);
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [deactivate]);
    const handleOnMouseOver = () => {
        setActiveTo(true);
        setDeactivateTo(false);
    };
    const handleOnMouseOut = () => setDeactivateTo(true);
    const getWindow = () => {
        if (active) {
            return (React.createElement(ContextMenuWindow, { level: props.level + 1, sections: props.action.sections, action: props.action, extensionRef: ref }));
        }
    };
    const getSpecialEffect = () => {
        if (props.action.label === ContextMenuActionLabel.Infinite) {
            return (React.createElement(SpecialEffect, { level: props.level }));
        }
    };
    return (React.createElement("div", { ref: ref, className: "context-menu-extension", onMouseEnter: handleOnMouseOver, onMouseLeave: handleOnMouseOut, style: { zIndex: active ? 2 : 1 } },
        React.createElement(ContextMenuAction, { id: props.action.id, className: props.action.className, label: ContextMenuUtility.getActionDisplayLabel(props.action.label, props.level), icon: props.action.icon, effect: getSpecialEffect() }),
        React.createElement("i", { className: "fa-solid fa-caret-right" }),
        getWindow()));
};
const InfiniteContextMenuExtension = (props) => {
    const { setModeToInfinite } = React.useContext(AppContext);
    const { state } = React.useContext(ContextMenuContext);
    const mapAction = () => {
        if (props.level === 14) {
            return Object.assign(Object.assign({}, props.action), { sections: [
                    ContextMenuUtility.mapSection([
                        ContextMenuUtility.mapAction("DO NOT PRESS", "fa-solid fa-infinity", "do-not-press", setModeToInfinite)
                    ])
                ] });
        }
        return InfiniteContextMenuUtility.mapAction(props.action);
    };
    const [action, setActionTo] = React.useState(mapAction()), [reversed, setReversedTo] = React.useState(false);
    React.useEffect(() => {
        const entry = ContextMenuUtility.getDirectionEntry(props.action, state.directionHistory);
        if (entry && entry.vertical === Vertical.Up && !reversed) {
            setReversedTo(true);
        }
        else if (!entry || (entry.vertical === Vertical.Down && reversed)) {
            setReversedTo(false);
        }
    }, [state.directionHistory]);
    React.useEffect(() => {
        if (reversed) {
            const updatedAction = mapAction();
            setActionTo(Object.assign(Object.assign({}, updatedAction), { sections: updatedAction.sections.reverse() }));
        }
        else {
            setActionTo(mapAction());
        }
    }, [reversed]);
    return (React.createElement(ContextMenuExtension, { key: action.id, action: action, level: props.level }));
};
const ContextMenuSection = (props) => {
    const getActions = () => {
        return props.actions.map((action) => {
            if (action.label === ContextMenuActionLabel.Infinite) {
                return (React.createElement(InfiniteContextMenuExtension, { key: action.id, action: action, level: props.level }));
            }
            else if (action.sections) {
                return (React.createElement(ContextMenuExtension, { key: action.id, action: action, level: props.level }));
            }
            return (React.createElement(ContextMenuAction, { key: action.id, id: action.id, className: action.className, label: action.label, icon: action.icon, sections: action.sections || [], onClick: action.onClick }));
        });
    };
    return (React.createElement("div", { className: "context-menu-section" }, getActions()));
};
const ContextMenuWindow = (props) => {
    const { state, addDirectionHistoryEntry } = React.useContext(ContextMenuContext);
    const [entered, setEnteredTo] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (props.extensionRef && props.action) {
            const entry = ContextMenuDirectionUtility.determineDirection(props.action, state.directionHistory, props.extensionRef, ref);
            addDirectionHistoryEntry(entry, props.level === 1 ? props.action.id : null);
        }
    }, []);
    React.useEffect(() => {
        const timeout = setTimeout(() => setEnteredTo(true), 250);
        return () => clearTimeout(timeout);
    }, []);
    const getSections = () => {
        return props.sections.map((section) => (React.createElement(ContextMenuSection, { key: section.id, id: section.id, actions: section.actions, level: props.level })));
    };
    const getWindowEffect = () => {
        if (props.level > 5) {
            return (React.createElement(WindowEffect, { level: props.level, duration: 1000 }));
        }
    };
    const getEscalationLevel = () => {
        if (entered && props.level === 14) {
            return 1;
        }
        return 0;
    };
    const position = ContextMenuUtility.getPositionFromDirectionEntry(props.action, state.directionHistory), escalationLevelClass = `escalation-level-${getEscalationLevel()}`;
    return (React.createElement("div", { ref: ref, className: classNames("context-menu-window", escalationLevelClass), style: position },
        getSections(),
        getWindowEffect()));
};
const ContextMenu = () => {
    const { state, setMenuRefTo } = React.useContext(ContextMenuContext);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref !== null && ref.current !== null) {
            setMenuRefTo(ref);
        }
    }, [state.targetRef]);
    return (React.createElement("div", { ref: ref, id: "context-menu", style: ContextMenuUtility.determineMountPosition(ref, state.position) },
        React.createElement(ContextMenuWindow, { sections: state.sections, level: 0 })));
};
const defaultContextMenuState = (active) => ({
    active: active || false,
    branchID: "",
    position: {
        left: (window.innerWidth / 2) - 150,
        top: (window.innerHeight / 2) - 170
    },
    sections: [],
    directionHistory: [],
    targetRef: null,
    menuRef: null
});
const ContextMenuContext = React.createContext(null);
const ContextMenuWrapper = (props) => {
    const { mode } = React.useContext(AppContext);
    const [state, setStateTo] = React.useState(defaultContextMenuState(true));
    const setActiveTo = (active) => {
        setStateTo(Object.assign(Object.assign({}, state), { active }));
    };
    const setMenuRefTo = (menuRef) => {
        setStateTo(Object.assign(Object.assign({}, state), { menuRef }));
    };
    const activateMenu = (position) => {
        setStateTo(Object.assign(Object.assign({}, state), { active: true, position }));
    };
    const updateDirectionHistory = (directionHistory, branchID) => {
        const updated = Object.assign(Object.assign({}, state), { directionHistory });
        if (branchID || branchID === "") {
            updated.branchID = branchID;
        }
        setStateTo(updated);
    };
    const addDirectionHistoryEntry = (entry, branchID) => {
        if (branchID) {
            updateDirectionHistory([entry], branchID);
        }
        else {
            updateDirectionHistory([...state.directionHistory, entry]);
        }
    };
    const truncateDirectionHistoryAtEntry = (actionID) => {
        const targetIndex = state.directionHistory.findIndex((entry) => entry.actionID === actionID);
        if (targetIndex > 0) {
            const updatedDirectionHistory = [...state.directionHistory].slice(0, targetIndex), branchID = updateDirectionHistory.length === 0 ? "" : null;
            updateDirectionHistory(updatedDirectionHistory, branchID);
        }
    };
    React.useEffect(() => {
        setStateTo(Object.assign(Object.assign({}, state), { sections: props.sections, targetRef: props.targetRef }));
    }, [props.targetRef, props.sections]);
    React.useEffect(() => {
        if (state.targetRef !== null && state.targetRef.current !== null) {
            state.targetRef.current.onclick = (e) => {
                if (ContextMenuUtility.shouldDectivate(state.menuRef, e)) {
                    setStateTo(defaultContextMenuState());
                }
            };
            state.targetRef.current.oncontextmenu = (e) => {
                if (ContextMenuUtility.shouldActivate(state.menuRef, e)) {
                    e.preventDefault();
                    activateMenu({ left: e.clientX, top: e.clientY });
                }
            };
        }
    }, [state.targetRef, state.menuRef, mode]);
    if (state.active) {
        return (React.createElement(ContextMenuContext.Provider, { value: {
                state,
                activateMenu,
                setActiveTo,
                setMenuRefTo,
                addDirectionHistoryEntry,
                truncateDirectionHistoryAtEntry
            } },
            React.createElement(ContextMenu, null)));
    }
    return null;
};
var AppMode;
(function (AppMode) {
    AppMode["Normal"] = "Normal";
    AppMode["Infinite"] = "Infinite";
})(AppMode || (AppMode = {}));
const defaultAppState = () => ({
    mode: AppMode.Normal
});
const AppContext = React.createContext(null);
const App = () => {
    const ref = React.useRef(null);
    const [appState, setAppStateTo] = React.useState(defaultAppState());
    const setModeTo = (mode) => {
        setAppStateTo(Object.assign(Object.assign({}, appState), { mode }));
    };
    const setModeToInfinite = () => setModeTo(AppMode.Infinite), setModeToNormal = () => setModeTo(AppMode.Normal);
    const getAppContent = () => {
        if (appState.mode === AppMode.Infinite) {
            return (React.createElement(React.Fragment, null,
                React.createElement(WindowEffect, { level: 9, duration: 1000 }),
                React.createElement(InfiniteCanvas, null),
                React.createElement(NoMoreOptionsText, null),
                React.createElement("button", { type: "button", id: "reset-mode-button", className: "rubik-font", onClick: setModeToNormal }, "Reset")));
        }
        return (React.createElement(ContextMenuWrapper, { targetRef: ref, sections: ContextMenuTestUtility.getMenuSections() }));
    };
    return (React.createElement(AppContext.Provider, { value: { mode: appState.mode, setModeToInfinite, setModeToNormal } },
        React.createElement("div", { ref: ref, id: "infinite-app", className: appState.mode.toLowerCase() },
            React.createElement("div", { id: "infinite-app-links" },
                React.createElement("a", { href: "https://www.youtube.com/c/Hyperplexed", target: "_blank" },
                    React.createElement("i", { className: "fa-brands fa-youtube" })),
                React.createElement("a", { href: "https://codepen.io/Hyperplexed", target: "_blank" },
                    React.createElement("i", { className: "fa-brands fa-codepen" })),
                React.createElement("a", { href: "https://github.com/githyperplexed/infinite-context-menu", target: "_blank" },
                    React.createElement("i", { className: "fa-brands fa-github" }))),
            getAppContent())));
    return (React.createElement("div", { id: "app" }));
};
ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
