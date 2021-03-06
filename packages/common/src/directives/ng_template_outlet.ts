/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, EmbeddedViewRef, Input, OnChanges, SimpleChange, SimpleChanges, TemplateRef, ViewContainerRef} from '@angular/core';

/**
 *  @ngModule CommonModule
 *
 *  @description
 *
 * Вставляет встроенное представление из подготовленного `TemplateRef`.
 *
 * Вы можете присоединить объект контекста к `EmbeddedViewRef` , установив `[ngTemplateOutletContext]`.
 *  `[ngTemplateOutletContext]`должен быть объектом, ключи объекта будут доступны для привязки
 * на локальный шаблон `let` декларации.
 *
 *  @usageNotes
 *  ```
 *  <ng-containerngTemplateOutlet="templateRefExp; context: contextExp"></ng-container>
 *  ```
 *
 * Использование ключа `$implicit` в объекте контекста установит его значение по умолчанию.
 *
 *  ### Пример
 *
 *  {@example common/ngTemplateOutlet/ts/module.ts region='NgTemplateOutlet'}
 *
 * @publicApi
 */
@Directive({selector: '[ngTemplateOutlet]'})
export class NgTemplateOutlet implements OnChanges {
  private _viewRef: EmbeddedViewRef<any>|null = null;

  /**
   * A context object to attach to the {@link EmbeddedViewRef}. This should be an
   * object, the object's keys will be available for binding by the local template `let`
   * declarations.
   * Using the key `$implicit` in the context object will set its value as default.
   */
  @Input() public ngTemplateOutletContext: Object|null = null;

  /**
   * A string defining the template reference and optionally the context object for the template.
   */
  @Input() public ngTemplateOutlet: TemplateRef<any>|null = null;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges) {
    const recreateView = this._shouldRecreateView(changes);

    if (recreateView) {
      const viewContainerRef = this._viewContainerRef;

      if (this._viewRef) {
        viewContainerRef.remove(viewContainerRef.indexOf(this._viewRef));
      }

      this._viewRef = this.ngTemplateOutlet ?
          viewContainerRef.createEmbeddedView(this.ngTemplateOutlet, this.ngTemplateOutletContext) :
          null;
    } else if (this._viewRef && this.ngTemplateOutletContext) {
      this._updateExistingContext(this.ngTemplateOutletContext);
    }
  }

  /**
   * We need to re-create existing embedded view if:
   * - templateRef has changed
   * - context has changes
   *
   * We mark context object as changed when the corresponding object
   * shape changes (new properties are added or existing properties are removed).
   * In other words we consider context with the same properties as "the same" even
   * if object reference changes (see https://github.com/angular/angular/issues/13407).
   */
  private _shouldRecreateView(changes: SimpleChanges): boolean {
    const ctxChange = changes['ngTemplateOutletContext'];
    return !!changes['ngTemplateOutlet'] || (ctxChange && this._hasContextShapeChanged(ctxChange));
  }

  private _hasContextShapeChanged(ctxChange: SimpleChange): boolean {
    const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
    const currCtxKeys = Object.keys(ctxChange.currentValue || {});

    if (prevCtxKeys.length === currCtxKeys.length) {
      for (let propName of currCtxKeys) {
        if (prevCtxKeys.indexOf(propName) === -1) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  private _updateExistingContext(ctx: Object): void {
    for (let propName of Object.keys(ctx)) {
      (<any>this._viewRef!.context)[propName] = (<any>this.ngTemplateOutletContext)[propName];
    }
  }
}
