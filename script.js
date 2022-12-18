 enum Color {
  Red = "229, 57, 53",
  Orange = "255, 152, 0",
  Yellow = "253, 216, 53",
  Green = "76, 175, 80",
  Blue = "30, 136, 229",
  Purple = "123, 31, 162",    
  White = "255, 255, 255"
}

enum Vertical {  
  Up = "Up",
  Down = "Down"
}

enum Lateral {
  Left = "Left",
  Right = "Right",
  None = ""
}

enum ContextMenuActionLabel {
  Infinite = "Infinite"
}

enum CanvasContextMenuWindowSize {
  Height = 302,
  Width = 340
}

interface ICoordinate {
  x: number;
  y: number;
}

interface IDirectionEntry {
  id: string;
  actionID: string;
  lateral: Lateral;
  vertical: Vertical;
}

interface IPosition {
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
}

interface ICanvasContextMenuWindow {
  id: string;
  coordinate: ICoordinate;
  speed: ICoordinate;
  destroyedAt: number;
}

interface IContextMenuAction {
  id: string;
  className?: string;
  label: string;
  icon: string;
  sections?: IContextMenuSection[];
  onClick?: () => void;
}

interface IContextMenuSection {
  id: string;
  actions: IContextMenuAction[];
}

interface INumberUtility {
  rand: (min: number, max: number) => number;
}

const N: INumberUtility = {
  rand: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
}

interface IInfiniteContextMenuDirectionUtility {
  determineDirection: (actionID: string, history: IDirectionEntry[], extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>) => IDirectionEntry;  
  validateLateralMovement: (lateral: Lateral, extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>) => Lateral;  
  validateVerticalMovement: (vertical: Vertical, extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>) => Vertical;
}
  
const InfiniteContextMenuDirectionUtility: IInfiniteContextMenuDirectionUtility = { 
  determineDirection: (actionID: string, history: IDirectionEntry[], extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>): IDirectionEntry => {    
    const previousDirection: IDirectionEntry = history[history.length - 1];

    return {
      id: Math.random().toString(),
      actionID,
      lateral: InfiniteContextMenuDirectionUtility.validateLateralMovement(previousDirection.lateral, extensionRef, windowRef),
      vertical: InfiniteContextMenuDirectionUtility.validateVerticalMovement(previousDirection.vertical, extensionRef, windowRef)
    }
  },
  validateLateralMovement: (lateral: Lateral, extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>): Lateral => {    
    if(
      extensionRef.current !== null &&
      windowRef.current !== null
    ) {
      const extensionRect: DOMRect = extensionRef.current.getBoundingClientRect();

      const tooFarRight: boolean = extensionRect.right + windowRef.current.clientWidth > window.innerWidth - 10,
        tooFarLeft: boolean = extensionRect.left - windowRef.current.clientWidth < 10;

      if (tooFarLeft && tooFarRight) {
        return Lateral.None;
      } else if(lateral === Lateral.Right && tooFarRight) {
        return Lateral.Left;
      } else if(lateral === Lateral.Left && tooFarLeft) {
        return Lateral.Right;
      }
    }

    return lateral;
  },
  validateVerticalMovement: (vertical: Vertical, extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>): Vertical => {
    if(
      extensionRef.current !== null &&
      windowRef.current !== null
    ) {
      const extensionRect: DOMRect = extensionRef.current.getBoundingClientRect();

      if(vertical === Vertical.Down && extensionRect.top + windowRef.current.clientHeight - 10 > window.innerHeight - 10) {
        return Vertical.Up;
      } else if (vertical === Vertical.Up && (extensionRect.bottom + 10) - windowRef.current.clientHeight < 10) {
        return Vertical.Down;
      }
    }

    return vertical;
  }
}

interface IContextMenuDirectionUtility {
  determineDirection: (action: IContextMenuAction, history: IDirectionEntry[], extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>) => IDirectionEntry;
  determineStandardDirection: (actionID: string, extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>) => IDirectionEntry;
}
  
const ContextMenuDirectionUtility: IContextMenuDirectionUtility = {
  determineDirection: (action: IContextMenuAction, history: IDirectionEntry[], extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>): IDirectionEntry => {
    if(action.label === ContextMenuActionLabel.Infinite && history.length > 0) {
      return InfiniteContextMenuDirectionUtility.determineDirection(action.id, history, extensionRef, windowRef);
    }

    return ContextMenuDirectionUtility.determineStandardDirection(action.id, extensionRef, windowRef);
  },  
  determineStandardDirection: (actionID: string, extensionRef: React.MutableRefObject<HTMLElement>, windowRef: React.MutableRefObject<HTMLElement>): IDirectionEntry => {
    const entry: IDirectionEntry = {
      id: Math.random().toString(),
      actionID,
      lateral: Lateral.Right,
      vertical: Vertical.Down
    }

    if(
      extensionRef.current !== null &&
      windowRef.current !== null
    ) {
      const extensionRect: DOMRect = extensionRef.current.getBoundingClientRect();

      const tooFarRight: boolean = extensionRect.right + windowRef.current.clientWidth > window.innerWidth - 10,
        tooFarLeft: boolean = extensionRect.left - windowRef.current.clientWidth < 10

      if(tooFarRight && tooFarLeft) {
        entry.lateral = Lateral.None;
      } else if(tooFarRight) {
        entry.lateral = Lateral.Left;
      } else if(tooFarLeft) {
        entry.lateral = Lateral.Right;
      }

      if(extensionRect.top + windowRef.current.clientHeight - 10 > window.innerHeight - 10) {
        entry.vertical = Vertical.Up;
      }
    }

    return entry;
  }
}

interface IInfiniteContextMenuUtility {  
  getActionLabel: (level: number) => string;
  getDefaultAction: () => IContextMenuAction;
  getEffectColor: (level: number, index: number) => string;
  getEffectIcon: (level: number) => string;
  getMenuSections: () => IContextMenuSection[];
  getWindowLevelID: (level: number) => string;
  mapAction: (action: IContextMenuAction) => IContextMenuAction;
}

const InfiniteContextMenuUtility: IInfiniteContextMenuUtility = { 
  getActionLabel: (level: number): string => {
    switch(level) {
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
  getDefaultAction: (): IContextMenuAction => {
    return {
      id: Math.random().toString(),
      label: ContextMenuActionLabel.Infinite,
      icon: "fa-solid fa-infinity"
    }
  },
  getEffectColor: (level: number, index: number): string => {
    switch(level) {
      case 4:
        return Color.Green;
      case 5:
        return Color.Red;
      case 6:
        if(index % 3 === 0) {
          return Color.Blue;
        } else if (index % 2 === 0) {
          return Color.Red;
        }

        return Color.White;
      case 7:
        if(index % 3 === 0) {
          return Color.Blue;
        } else if (index % 2 === 0) {
          return Color.Green;
        }

        return Color.White;
      case 8:
        if(index % 3 === 0) {
          return Color.Purple;
        } else if (index % 2 === 0) {
          return Color.Blue;
        }

        return Color.White;
      case 9:
        if(index % 7 === 0) {
          return Color.White;
        } else if(index % 6 === 0) {
          return Color.Purple;
        } else if (index % 5 === 0) {
          return Color.Blue;
        } else if (index % 4 === 0) {
          return Color.Green;
        } else if (index % 3 === 0) {
          return Color.Yellow;
        } else if (index % 2 === 0) {
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
  getEffectIcon: (level: number): string => {
    switch(level) {
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
  getMenuSections: (): IContextMenuSection[] => {
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
  getWindowLevelID: (level: number): string => {
    return `infinite-context-menu-window-level-${level}`;
  },
  mapAction: (action: IContextMenuAction): IContextMenuAction => {
    return {
      ...action,
      sections: InfiniteContextMenuUtility.getMenuSections()
    }
  }
}

interface IContextMenuUtility {
  determinePositionFromDirection: (entry: IDirectionEntry) => IPosition;  
  determineMountPosition: (ref: React.MutableRefObject<HTMLElement>, position: IPosition) => IPosition;  
  getActionDisplayLabel: (label: string, level: number) => string;
  getDirectionEntry: (action: IContextMenuAction, directionHistory: IDirectionEntry[]) => IDirectionEntry;  
  getPositionFromDirectionEntry: (action: IContextMenuAction, directionHistory: IDirectionEntry[]) => IPosition;  
  mapAction: (label: string, icon: string, className?: string, onClick?: () => void, sections?: IContextMenuSection[]) => IContextMenuAction;  
  mapSection: (actions: IContextMenuAction[]) => IContextMenuSection;
  shouldActivate: (ref: React.MutableRefObject<HTMLElement>, e: any) => boolean;
  shouldDectivate: (ref: React.MutableRefObject<HTMLElement>, e: any) => boolean;  
}

const ContextMenuUtility: IContextMenuUtility = {
  determinePositionFromDirection: (entry: IDirectionEntry): IPosition => {
    const position: IPosition = {};

    if(entry) {
      if(entry.lateral === Lateral.None) {
        position.left = "-10px";

        if(entry.vertical === Vertical.Down) {
          position.top = "100%";
        } else {
          position.bottom = "100%";
        }
      } else {
        if(entry.lateral === Lateral.Right) {
          position.left = "100%";
        } else if(entry.lateral === Lateral.Left) {
          position.right = "100%";
        }

        if(entry.vertical === Vertical.Down) {
          position.top = "-10px";
        } else {
          position.bottom = "-10px";
        }
      }
    }

    return position;
  },
  determineMountPosition: (ref: React.MutableRefObject<HTMLElement>, position: IPosition): IPosition => {
    const mountPosition: IPosition = {};

    if(ref.current !== null) {
      const rect: DOMRect = ref.current.getBoundingClientRect();

      const { left, top } = position as { left: number, top: number };

      if(left + rect.width > window.innerWidth) {
        mountPosition.right = `${Math.max(window.innerWidth - left, 10)}px`
      } else {
        mountPosition.left = `${Math.max(left, 10)}px`;
      }

      if(top + rect.height > window.innerHeight) {
        mountPosition.bottom = `${Math.max(window.innerHeight - top, 10)}px`;
      } else {
        mountPosition.top = `${Math.max(top, 10)}px`;
      }
    }

    return mountPosition;
  },
  getActionDisplayLabel: (label: string, level: number): string => {
    if(label === ContextMenuActionLabel.Infinite) {
      return InfiniteContextMenuUtility.getActionLabel(level);
    }

    return label;
  },
  getDirectionEntry: (action: IContextMenuAction, directionHistory: IDirectionEntry[]): IDirectionEntry => {
    if(action && directionHistory.length > 0) {
      return directionHistory.find((entry: IDirectionEntry) => entry.actionID === action.id);
    }

    return null;
  },
  getPositionFromDirectionEntry: (action: IContextMenuAction, directionHistory: IDirectionEntry[]): IPosition => {
    const entry: IDirectionEntry = ContextMenuUtility.getDirectionEntry(action, directionHistory);

    return ContextMenuUtility.determinePositionFromDirection(entry);
  },
  mapAction: (label: string, icon: string, className?: string, onClick?: () => void, sections?: IContextMenuSection[]): IContextMenuAction => {
    const action: IContextMenuAction = {
      id: Math.random().toString(),
      label,
      icon
    }

    if(className) {
      action.className = className;
    }

    if(onClick) {
      action.onClick = onClick;
    }

    if(sections) {
      action.sections = sections;
    }

    return action;
  },
  mapSection: (actions: IContextMenuAction[]): IContextMenuSection => {
    return {
      actions,
      id: Math.random().toString()
    }
  },
  shouldActivate: (ref: React.MutableRefObject<HTMLElement>, e: any): boolean => {
    return (      
      ref === null || 
      ref.current === null || 
      !ref.current.contains(e.target)
    );
  },
  shouldDectivate: (ref: React.MutableRefObject<HTMLElement>, e: any): boolean => {
    return (
      ref !== null && 
      ref.current !== null && 
      !ref.current.contains(e.target)
    );
  }
}

interface IContextMenuTestUtility {
  getMenuSections: () => IContextMenuSection[];  
}

const ContextMenuTestUtility: IContextMenuTestUtility = {
  getMenuSections: (): IContextMenuSection[] => {
    const settingsSections: IContextMenuSection[] = [
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
    ]
  }
}

interface ICanvasUtility {  
  drawCanvas: (context: CanvasRenderingContext2D) => void;
  getAnimatedValue: (initial: number, final: number, duration: number, timestamp: number) => number;
  getAnimationPercent: (duration: number, timestamp: number) => number;
}

const CanvasUtility: ICanvasUtility = {
  getAnimatedValue: (initial: number, final: number, duration: number, timestamp: number): number => {
    const percent: number = CanvasUtility.getAnimationPercent(duration, timestamp);
    
    if(percent >= 1 || initial === final) return final;
    
    const diff = final - initial;
    
    return initial + (diff * percent);
  },
  drawCanvas: (context: CanvasRenderingContext2D): void => {
    const height = context.canvas.clientHeight,
      width = context.canvas.clientWidth;

    context.canvas.height = height;
    context.canvas.width = width;
  },
  getAnimationPercent: (duration: number, timestamp: number): number => {
    if(timestamp === null) return 1;
    
    const now: number = new Date().getTime(),
          diff: number = now - timestamp;
    
    return diff / duration;
  }
}

interface IReticleUtility {
  draw: (context: CanvasRenderingContext2D, coordinate: ICoordinate, clickAt: number) => void;  
}

const ReticleUtility: IReticleUtility = {
  draw: (context: CanvasRenderingContext2D, coordinate: ICoordinate, clickAt: number): void => {  
    context.lineWidth = 3;
    
    context.lineCap = "round";

    const radius: number = 40,
      white: string = `rgba(${Color.White}, ${CanvasUtility.getAnimatedValue(0, 100, 250, clickAt) / 100})`;

    for(let i = 0.08; i < 2; i += 0.5) {
      context.beginPath();
  
      context.strokeStyle = `rgb(${Color.Blue})`;

      context.arc(coordinate.x, coordinate.y, radius, Math.PI * i, Math.PI * (0.34 + i));
    
      context.stroke();  
    }
    
    for(let i = 0.1; i < 2; i += 0.5) {
      context.beginPath();
  
      context.strokeStyle = white;

      context.arc(coordinate.x, coordinate.y, CanvasUtility.getAnimatedValue(radius * 1.5, radius * 0.75, 250, clickAt), Math.PI * i, Math.PI * (0.3 + i));
    
      context.stroke();  
    }

    context.beginPath();

    const length: number = CanvasUtility.getAnimatedValue(radius * 1.25, radius * 1.5, 250, clickAt);

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
}

interface IWindowUtility {
  create: (context: CanvasRenderingContext2D, index: number) => ICanvasContextMenuWindow;
  determineSpeed: (context: CanvasRenderingContext2D, coordinate: ICoordinate, height: number, width: number, speed: ICoordinate) => ICoordinate;  
  drawImage: (context: CanvasRenderingContext2D, img: HTMLImageElement, w: ICanvasContextMenuWindow, clickAt: number, mouse: ICoordinate) => void;    
  drawAll: (context: CanvasRenderingContext2D, img: HTMLImageElement, windows: ICanvasContextMenuWindow[], clickAt: number, mouse: ICoordinate) => void;    
  filterOutDestroyed: (windows: ICanvasContextMenuWindow[], clickAt: number) => ICanvasContextMenuWindow[];  
  isClickInWindow: (start: ICoordinate, size: ISize, mouse: ICoordinate) => boolean;
}

const WindowUtility: IWindowUtility = {
  create: (context: CanvasRenderingContext2D, index: number): ICanvasContextMenuWindow => {    
    const speed: ICoordinate = {
      x: index % 2 === 0 ? 1 : -1,
      y: index % 2 === 0 ? 1 : -1
    }

    const origin: ICoordinate = {
      x: context.canvas.width / 2, 
      y: index % 2 === 0 ? CanvasContextMenuWindowSize.Height * -1 : context.canvas.height + CanvasContextMenuWindowSize.Height
    }

    return {
      id: Math.random().toString(),
      coordinate: { ...origin },
      speed: { ...speed },
      destroyedAt: null
    };
  },
  determineSpeed: (context: CanvasRenderingContext2D, coordinate: ICoordinate, height: number, width: number, speed: ICoordinate): ICoordinate => {    
    const updated: ICoordinate = { ...speed };

    if(updated.x > 0 && coordinate.x + (width / 2) >= context.canvas.width) {
      updated.x = speed.x * -1;
    } else if (updated.x < 0 && coordinate.x - (width / 2) <= 0) {
      updated.x = speed.x * -1;
    }

    if(updated.y > 0 && coordinate.y + (height / 2) >= context.canvas.height) {
      updated.y = speed.y * -1;
    } else if(updated.y < 0 && coordinate.y - (height / 2) <= 0) {
      updated.y = speed.y * -1;
    }

    return updated;
  },
  drawImage: (context: CanvasRenderingContext2D, img: HTMLImageElement, w: ICanvasContextMenuWindow, clickAt: number, mouse: ICoordinate): void => {    
    if(img) {
      const size: ISize = {
        height: w.destroyedAt ? CanvasUtility.getAnimatedValue(CanvasContextMenuWindowSize.Height, CanvasContextMenuWindowSize.Height * 1.5, 100, w.destroyedAt) : CanvasContextMenuWindowSize.Height,
        width: w.destroyedAt ? CanvasUtility.getAnimatedValue(CanvasContextMenuWindowSize.Width, CanvasContextMenuWindowSize.Width * 1.5, 100, w.destroyedAt) : CanvasContextMenuWindowSize.Width
      }

      w.coordinate.x = w.coordinate.x + w.speed.x;
      w.coordinate.y = w.coordinate.y + w.speed.y;

      w.speed = WindowUtility.determineSpeed(context, w.coordinate, size.height, size.width, w.speed);

      const upperLeft: ICoordinate = {
        x: w.coordinate.x - (size.width / 2), 
        y: w.coordinate.y - (size.height / 2)
      }

      context.shadowBlur = 29;

      context.shadowColor = "rgba(10, 10, 10, 0.5)";

      context.shadowOffsetY = 7;

      if(w.destroyedAt) { 
        context.fillStyle = `rgba(20, 20, 20, ${CanvasUtility.getAnimatedValue(100, 0, 100, w.destroyedAt) / 100})`;
    
        context.fillRect(upperLeft.x, upperLeft.y, size.width, size.height);
      } else {
        context.drawImage(img, upperLeft.x, upperLeft.y, size.width, size.height);
      }

      if(WindowUtility.isClickInWindow(upperLeft, size, mouse)) {      
        const now: number = new Date().getTime();

        if(now - clickAt <= 10 && w.destroyedAt === null) {
          w.destroyedAt = now;
        }
      }
    }
  },
  drawAll: (context: CanvasRenderingContext2D, img: HTMLImageElement, windows: ICanvasContextMenuWindow[], clickAt: number, mouse: ICoordinate): void => {
    for(let w of windows) {
      WindowUtility.drawImage(context, img, w, clickAt, mouse);
    }
  },
  filterOutDestroyed: (windows: ICanvasContextMenuWindow[], clickAt: number): ICanvasContextMenuWindow[] => {
    const now: number = new Date().getTime();

    if(clickAt && now - clickAt < 500) {
      return windows.filter((w: ICanvasContextMenuWindow) => w.destroyedAt === null || now - w.destroyedAt <= 100);
    }

    return windows;
  },
  isClickInWindow: (start: ICoordinate, size: ISize, mouse: ICoordinate): boolean => {
    return (
      mouse.x >= start.x && 
      mouse.x <= start.x + size.width &&
      mouse.y >= start.y &&
      mouse.y <= start.y + size.height
    );
  }
}

const NoMoreOptionsText: React.FC = () => {
  const getText = (): JSX.Element[] => {
    return Array.from(Array(5)).map((x, i) => {
      const animationDelay: string = `${1000 * i}ms`;
      
      return (
        <span key={i} className="rubik-font" style={{ animationDelay }}>There are no more options</span>
      )
    });
  }

  return (
    <div id="no-more-options-text">
      {getText()}
    </div>
  );
}

const InfiniteCanvas: React.FC = () => {
  const ref = React.useRef<HTMLCanvasElement>(null),
    imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if(ref.current) {
      const context: CanvasRenderingContext2D = ref.current.getContext("2d");

      context.canvas.height = context.canvas.clientHeight;
      context.canvas.width = context.canvas.clientWidth;

      let clickAt: number = null;

      const mouse: ICoordinate = {
        x: context.canvas.width / 2, 
        y: context.canvas.height / 2
      }

      let index: number = 0,
        windows: ICanvasContextMenuWindow[] = [WindowUtility.create(context, index++)];
        
      const generate = (): void => {
        setTimeout(() => {
          if(windows.length < 100) {
            windows.push(WindowUtility.create(context, index++));
          }
  
          window.requestAnimationFrame(generate); 
        }, 600);
      }

      const draw = (): void => {   
        CanvasUtility.drawCanvas(context);

        windows = WindowUtility.filterOutDestroyed(windows, clickAt);

        WindowUtility.drawAll(context, imageRef.current, windows, clickAt, mouse);

        ReticleUtility.draw(context, mouse, clickAt);

        window.requestAnimationFrame(draw);
      }

      draw();

      generate();

      const handleOnMouseMove = (e: any): void => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }

      const handleOnResize = (e: any): void => {
        if(windows.length > 0) {
          windows = [];
        }
      }

      const handleOnClick = (e: any): void => {
        clickAt = new Date().getTime();
      }
      
      ref.current.addEventListener("mousemove", handleOnMouseMove);

      window.addEventListener("resize", handleOnResize);

      ref.current.addEventListener("mousedown", handleOnClick);

      return () => {
        window.removeEventListener("resize", handleOnResize);
      }
    }
  }, []);

  return (
    <canvas ref={ref} id="infinite-canvas">
      <img ref={imageRef} src="https://assets.codepen.io/1468070/infinite-menu-options.png" height="100" width="100" />
    </canvas>
  );
}

interface IWindowEffectIconProps {
  icon: string;
  duration: number;
  index: number;
  color: string;
}

const WindowEffectIcon: React.FC<IWindowEffectIconProps> = (props: IWindowEffectIconProps) => {   
  const delay: number = props.index * 250;
  
  const getRandomPositionOnSide = (side: number): IPosition => {
    if(side === 0) {
      return {
        left: `${N.rand(10, 90)}%`,
        top: `${N.rand(0, 30) * -1}px`
      }
    } else if(side === 1) {
      return {
        right: `${N.rand(0, 30) * -1}px`,
        top: `${N.rand(10, 90)}%`
      }
    } else if(side === 2) {
      return {
        left: `${N.rand(10, 90)}%`,
        bottom: `${N.rand(0, 30) * -1}px`
      }
    } else if(side === 3) {
      return {
        left: `${N.rand(0, 30) * -1}px`,
        top: `${N.rand(10, 90)}%`
      }
    }
  }

  const [position, setPositionTo] = React.useState<IPosition>(getRandomPositionOnSide(N.rand(0, 3)));

  React.useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      setPositionTo(getRandomPositionOnSide(N.rand(0, 3)));
    }, props.duration + delay);

    return () => clearTimeout(timeout);
  }, [position]);

  const getStyles = (): React.CSSProperties => {
    return {
      ...position,
      animationDelay: `${delay}ms`,
      animationDuration: `${props.duration}ms`,
      color: `rgb(${props.color})`
    }
  }
  
  const key: string = `${position.left}${position.top}`;

  return (
    <i key={key} className={props.icon} style={getStyles()} />
  );
}

interface IWindowEffectProps {
  duration: number;
  level: number;
}

const WindowEffect: React.FC<IWindowEffectProps> = (props: IWindowEffectProps) => {  
  const getIcons = (): JSX.Element[] => {
    return Array.from(Array(16)).map((x, index: number) => {            
      return (
        <WindowEffectIcon 
          key={index} 
          icon={InfiniteContextMenuUtility.getEffectIcon(props.level)} 
          duration={props.duration} 
          index={index} 
          color={InfiniteContextMenuUtility.getEffectColor(props.level, index)} 
        />
      )
    });
  }

  return (
    <div className="window-effect">
      {getIcons()}
    </div>
  );
}

interface ISparkleIconProps {
  icon: string;
  duration: number;
  index: number;
  color: string;
}

const SparkleIcon: React.FC<ISparkleIconProps> = (props: ISparkleIconProps) => {
  const delay: number = props.index * 250;

  const getRandomPosition = (): IPosition => ({
    left: `${N.rand(10, 90)}%`,
    top: `${N.rand(20, 80)}%`
  });

  const [position, setPositionTo] = React.useState<IPosition>(getRandomPosition());

  React.useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      setPositionTo(getRandomPosition());
    }, props.duration + delay);

    return () => clearTimeout(timeout);
  }, [position]);

  const getStyles = (): React.CSSProperties => {
    return {
      animationDelay: `${delay}ms`,
      animationDuration: `${props.duration}ms`,
      color: `rgb(${props.color})`,
      left: position.left,
      top: position.top
    }
  }
  
  const key: string = `${position.left}${position.top}`;

  return (
    <i key={key} className={props.icon} style={getStyles()} />
  );
}

interface IWaveEffectProps {
  duration: number;
  level: number;
}

export const WaveEffect: React.FC<IWaveEffectProps> = (props: IWaveEffectProps) => {
  const getStyles = (index: number): React.CSSProperties => {
    return {
      animationDelay: `${index * 200 * -1}ms`,
      animationDuration: `${props.duration}ms`,
      color: `rgb(${InfiniteContextMenuUtility.getEffectColor(props.level, index)})`,
      left: `${index * 30}px`
    }
  }

  const getIcons = (): JSX.Element[] => {
    return Array.from(Array(10)).map((x, index: number) => {            
      return (
        <i key={index} className={InfiniteContextMenuUtility.getEffectIcon(props.level)} style={getStyles(index)} />
      )
    });
  }

  const getEscalationLevel = (): number => {
    if(props.level <= 5 || props.level === 10) {
      return 0;
    } else if (props.level === 6 || props.level === 7 || (props.level >= 11 && props.level <= 13)) {
      return 1;
    } else if (props.level === 8) {
      return 2;
    } else if(props.level === 9 || props.level === 14) {
      return 3;
    }

    return 0;
  }
  
  const escalationLevelClass: string = `escalation-level-${getEscalationLevel()}`;

  return (
    <div className={classNames("wave-effect", escalationLevelClass)}>
      {getIcons()}
    </div>
  );
}

interface ISparkleEffectProps {
  duration: number;
  level: number;
}

const SparkleEffect: React.FC<ISparkleEffectProps> = (props: ISparkleEffectProps) => {
  const getIcon = (): string => {
    switch(props.level) {
      default:
        return "fa-solid fa-star-sharp";
    }
  }

  const getColor = (): string => {
    switch(props.level) {
      case 1:
        return Color.Green;
      case 2:
        return Color.Purple;
      default:
        return Color.Blue;
    }
  }

  const getIcons = (): JSX.Element[] => {
    return Array.from(Array(8)).map((x, index: number) => {            
      return (
        <SparkleIcon 
          key={index} 
          icon={getIcon()} 
          duration={props.duration} 
          index={index} 
          color={getColor()} 
        />
      )
    });
  }

  return (
    <div className="sparkle-effect">
      {getIcons()}
    </div>
  );
}

interface ISpecialEffectProps {
  level: number;
}

const SpecialEffect: React.FC<ISpecialEffectProps> = (props: ISpecialEffectProps) => {
  const getSpecialEffect = (): JSX.Element => {
    switch(props.level) {
      case 0:
      case 1:
      case 2:
        return (
          <SparkleEffect level={props.level} duration={1500} />
        );
      default:
        return (
          <WaveEffect level={props.level} duration={4000} />
        );
    }
  }

  return (
    <div className="special-effect">
      {getSpecialEffect()}
    </div>
  );
}

interface IContextMenuActionProps extends IContextMenuAction {
  effect?: JSX.Element;
}

const ContextMenuAction: React.FC<IContextMenuActionProps> = (props: IContextMenuActionProps) => {
  return (
    <button type="button" className={classNames("context-menu-action", props.className)} onClick={props.onClick}>
      <i className={props.icon} />
      <span className="label rubik-font">{props.label}</span>
      {props.effect || null}
    </button>
  );
}

interface IContextMenuExtensionProps {
  action: IContextMenuAction;
  level: number;
}

const ContextMenuExtension: React.FC<IContextMenuExtensionProps> = (props: IContextMenuExtensionProps) => {    
  const { state, truncateDirectionHistoryAtEntry } = React.useContext(ContextMenuContext);

  const [active, setActiveTo] = React.useState<boolean>(false),
    [deactivate, setDeactivateTo] = React.useState<boolean>(false);

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {  
    if(props.level === 0 && state.branchID !== props.action.id) {
      setActiveTo(false);
    }
  }, [state.directionHistory]);

  React.useEffect(() => {
    if(deactivate) {
      const timeout: NodeJS.Timeout = setTimeout(() => {
        truncateDirectionHistoryAtEntry(props.action.id);
        setActiveTo(false);
        setDeactivateTo(false);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [deactivate]);

  const handleOnMouseOver = (): void => {
    setActiveTo(true);
    setDeactivateTo(false);
  }
    
  const handleOnMouseOut = (): void => setDeactivateTo(true);

  const getWindow = (): JSX.Element => {
    if(active) {
      return (
        <ContextMenuWindow 
          level={props.level + 1} 
          sections={props.action.sections}
          action={props.action}
          extensionRef={ref} 
        />
      );
    }
  }

  const getSpecialEffect = (): JSX.Element => {
    if(props.action.label === ContextMenuActionLabel.Infinite) {
      return (
        <SpecialEffect level={props.level} />
      )
    }
  }

  return (
    <div ref={ref} className="context-menu-extension" onMouseEnter={handleOnMouseOver} onMouseLeave={handleOnMouseOut} style={{ zIndex: active ? 2 : 1 }}>
      <ContextMenuAction 
        id={props.action.id} 
        className={props.action.className}
        label={ContextMenuUtility.getActionDisplayLabel(props.action.label, props.level)} 
        icon={props.action.icon}
        effect={getSpecialEffect()}
      />
      <i className="fa-solid fa-caret-right" />
      {getWindow()}
    </div>
  );
}

interface IInfiniteContextMenuExtensionProps {
  action: IContextMenuAction;
  level: number;
}

const InfiniteContextMenuExtension: React.FC<IInfiniteContextMenuExtensionProps> = (props: IInfiniteContextMenuExtensionProps) => {  
  const { setModeToInfinite } = React.useContext(AppContext);

  const { state } = React.useContext(ContextMenuContext);

  const mapAction = (): IContextMenuAction => {
    if(props.level === 14) {
      return {
        ...props.action,
        sections: [
          ContextMenuUtility.mapSection([
            ContextMenuUtility.mapAction("DO NOT PRESS", "fa-solid fa-infinity", "do-not-press", setModeToInfinite)
          ])
        ]
      };
    }

    return InfiniteContextMenuUtility.mapAction(props.action);
  }

  const [action, setActionTo] = React.useState<IContextMenuAction>(mapAction()),
    [reversed, setReversedTo] = React.useState<boolean>(false);

  React.useEffect(() => {
    const entry: IDirectionEntry = ContextMenuUtility.getDirectionEntry(props.action, state.directionHistory);

    if(entry && entry.vertical === Vertical.Up && !reversed) {
      setReversedTo(true);
    } else if (!entry || (entry.vertical === Vertical.Down && reversed)) {
      setReversedTo(false);      
    }
  }, [state.directionHistory]);

  React.useEffect(() => {
    if(reversed) {
      const updatedAction: IContextMenuAction = mapAction();

      setActionTo({ ...updatedAction, sections: updatedAction.sections.reverse() });
    } else {
      setActionTo(mapAction())
    }
  }, [reversed]);

  return (
    <ContextMenuExtension 
      key={action.id} 
      action={action} 
      level={props.level} 
    />
  );
}

interface IContextMenuProps extends IContextMenuSection {
  level: number;
}

const ContextMenuSection: React.FC<IContextMenuProps> = (props: IContextMenuProps) => {
  const getActions = (): JSX.Element[] => {
    return props.actions.map((action: IContextMenuAction) => {
      if(action.label === ContextMenuActionLabel.Infinite) {
        return (
          <InfiniteContextMenuExtension key={action.id} action={action} level={props.level} />
        );
      } else if(action.sections) {
        return (
          <ContextMenuExtension key={action.id} action={action} level={props.level} />
        )
      }

      return (
        <ContextMenuAction 
          key={action.id} 
          id={action.id} 
          className={action.className}
          label={action.label} 
          icon={action.icon} 
          sections={action.sections || []}
          onClick={action.onClick}
        />
      );
    });
  }

  return (
    <div className="context-menu-section">
      {getActions()}
    </div>
  );
}

interface IContextMenuWindowProps {  
  level: number;
  sections: IContextMenuSection[];
  action?: IContextMenuAction;
  extensionRef?: React.MutableRefObject<HTMLDivElement>;
}

const ContextMenuWindow: React.FC<IContextMenuWindowProps> = (props: IContextMenuWindowProps) => {
  const { state, addDirectionHistoryEntry } = React.useContext(ContextMenuContext);

  const [entered, setEnteredTo] = React.useState<boolean>(false);

  const ref: React.MutableRefObject<HTMLDivElement> = React.useRef(null);

  React.useEffect(() => {
    if(props.extensionRef && props.action) {
      const entry: IDirectionEntry = ContextMenuDirectionUtility.determineDirection(props.action, state.directionHistory, props.extensionRef, ref);

      addDirectionHistoryEntry(entry, props.level === 1 ? props.action.id : null);
    }
  }, []);

  React.useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => setEnteredTo(true), 250);

    return () => clearTimeout(timeout);
  }, []);

  const getSections = (): JSX.Element[] => {
    return props.sections.map((section: IContextMenuSection) => (
      <ContextMenuSection key={section.id} id={section.id} actions={section.actions} level={props.level} />
    ));
  }

  const getWindowEffect = (): JSX.Element => {
    if(props.level > 5) {
      return (
        <WindowEffect level={props.level} duration={1000} />
      )
    }
  }

  const getEscalationLevel = (): number => {
    if(entered && props.level === 14) {
      return 1;
    }

    return 0;
  }

  const position: IPosition = ContextMenuUtility.getPositionFromDirectionEntry(props.action, state.directionHistory),
    escalationLevelClass: string = `escalation-level-${getEscalationLevel()}`;

  return (
    <div ref={ref} className={classNames("context-menu-window", escalationLevelClass)} style={position}>
      {getSections()}    
      {getWindowEffect()}
    </div>
  );
}

const ContextMenu: React.FC = () => {
  const { state, setMenuRefTo } = React.useContext<IContextMenuContext>(ContextMenuContext);

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if(ref !== null && ref.current !== null) {
      setMenuRefTo(ref);
    }
  }, [state.targetRef]);

  return (
    <div ref={ref} id="context-menu" style={ContextMenuUtility.determineMountPosition(ref, state.position)}>
      <ContextMenuWindow sections={state.sections} level={0} />
    </div>
  );
}

interface IContextMenuState {
  active: boolean;
  branchID: string;
  position: IPosition;
  sections: IContextMenuSection[];
  directionHistory: IDirectionEntry[];
  targetRef: React.MutableRefObject<HTMLElement>;
  menuRef: React.MutableRefObject<HTMLElement>;
}

const defaultContextMenuState = (active?: boolean): IContextMenuState => ({
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

interface IContextMenuWrapperProps {
  targetRef: React.MutableRefObject<HTMLElement>;
  sections: IContextMenuSection[];
}

const ContextMenuContext = React.createContext<IContextMenuContext>(null);

const ContextMenuWrapper: React.FC<IContextMenuWrapperProps> = (props: IContextMenuWrapperProps) => {
  const { mode } = React.useContext(AppContext);

  const [state, setStateTo] = React.useState<IContextMenuState>(defaultContextMenuState(true));

  const setActiveTo = (active: boolean): void => {
    setStateTo({ ...state, active });
  }

  const setMenuRefTo = (menuRef: React.MutableRefObject<HTMLElement>): void => {
    setStateTo({ ...state, menuRef });
  }

  const activateMenu = (position: IPosition): void => {
    setStateTo({ ...state, active: true, position });
  }

  const updateDirectionHistory = (directionHistory: IDirectionEntry[], branchID?: string): void => {
    const updated: IContextMenuState = { ...state, directionHistory };

    if(branchID || branchID === "") {
      updated.branchID = branchID;
    }

    setStateTo(updated);
  }

  const addDirectionHistoryEntry = (entry: IDirectionEntry, branchID?: string): void => {
    if(branchID) {
      updateDirectionHistory([entry], branchID);
    } else {
      updateDirectionHistory([...state.directionHistory, entry]);
    }
  }

  const truncateDirectionHistoryAtEntry = (actionID: string): void => {
    const targetIndex: number = state.directionHistory.findIndex((entry: IDirectionEntry) => entry.actionID === actionID);

    if(targetIndex > 0) {
      const updatedDirectionHistory: IDirectionEntry[] = [...state.directionHistory].slice(0, targetIndex),
        branchID: string = updateDirectionHistory.length === 0 ? "" : null;

      updateDirectionHistory(updatedDirectionHistory, branchID);
    }
  }

  React.useEffect(() => {
    setStateTo({ ...state, sections: props.sections, targetRef: props.targetRef });
  }, [props.targetRef, props.sections]);

  React.useEffect(() => {
    if(state.targetRef !== null && state.targetRef.current !== null) {
      state.targetRef.current.onclick = (e: any): void => {        
        if(ContextMenuUtility.shouldDectivate(state.menuRef, e)) {
          setStateTo(defaultContextMenuState());
        }
      }

      state.targetRef.current.oncontextmenu = (e: any): void => {
        if(ContextMenuUtility.shouldActivate(state.menuRef, e)) {
          e.preventDefault();

          activateMenu({ left: e.clientX, top: e.clientY });
        }
      }
    }
  }, [state.targetRef, state.menuRef, mode]);

  if(state.active) {
    return (
      <ContextMenuContext.Provider value={{ 
        state, 
        activateMenu, 
        setActiveTo, 
        setMenuRefTo,
        addDirectionHistoryEntry,
        truncateDirectionHistoryAtEntry
      }}>
        <ContextMenu />
      </ContextMenuContext.Provider>
    );
  }

  return null;
}

enum AppMode {
  Normal = "Normal",
  Infinite = "Infinite"
}

interface IAppContext {
  mode: AppMode;
  setModeToInfinite: () => void;
  setModeToNormal: () => void;
}

interface IAppState {
  mode: AppMode;
}

const defaultAppState = (): IAppState => ({
  mode: AppMode.Normal
})
const AppContext = React.createContext<IAppContext>(null);

const App: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [appState, setAppStateTo] = React.useState<IAppState>(defaultAppState());

  const setModeTo = (mode: AppMode): void => {
    setAppStateTo({ ...appState, mode });
  }

  const setModeToInfinite = (): void => setModeTo(AppMode.Infinite),
    setModeToNormal = (): void => setModeTo(AppMode.Normal);

  const getAppContent = (): JSX.Element => {
    if(appState.mode === AppMode.Infinite) {
      return (
        <>
          <WindowEffect level={9} duration={1000} />
          <InfiniteCanvas />
          <NoMoreOptionsText />
          <button type="button" id="reset-mode-button" className="rubik-font" onClick={setModeToNormal}>Reset</button>
        </>
      )
    }

    return (
      <ContextMenuWrapper targetRef={ref} sections={ContextMenuTestUtility.getMenuSections()} />
    )
  }

  return (
    <AppContext.Provider value={{ mode: appState.mode, setModeToInfinite, setModeToNormal }}>
      <div ref={ref} id="infinite-app" className={appState.mode.toLowerCase()}>        
        <div id="infinite-app-links">
          <a href="https://www.youtube.com/c/Hyperplexed" target="_blank"><i className="fa-brands fa-youtube" /></a>
          <a href="https://codepen.io/Hyperplexed" target="_blank"><i className="fa-brands fa-codepen" /></a>
          <a href="https://github.com/githyperplexed/infinite-context-menu" target="_blank"><i className="fa-brands fa-github" /></a>
        </div>
        {getAppContent()}
      </div>
    </AppContext.Provider>
  );

  return(
    <div id="app">
      
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"));
