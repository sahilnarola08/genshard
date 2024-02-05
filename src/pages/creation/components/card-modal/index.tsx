import { useState } from 'react'
import { ErrorMessage, FieldArray, Form, Formik } from 'formik'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import './style.sass'
import './style.model.scss'

import * as Yup from 'yup'
import { ICardModal } from './types'
import Checkbox from '../../../../shared/components/checkbox'
import InputText from '../../../../shared/components/input-text'
import { clearGenTicketData } from '../../../../state/ticket/actions'

const CardModal = ({
  isOpen,
  cardIndex,
  onClose,
  onSubmited,
  initValue,
  setCardValues,
  formValues, 
  setFormValues
}: ICardModal) => {


  let InputArray: any = [];
  const [state, setState] = useState<any>([{}]);

  const [isError, setIsError] = useState<boolean>(false);
  // const [formValues, setFormValues] = useState<any>({});

  // All Constants are

  const digitValid = (val: any) => /^\d+(\.\d+)?$/.test(val)

  const greaterZero = (val: any) => {
    if (Number(val) > 0) {
      return true
    }
    return false
  }

  const perValidate = (val: any, data: any) => {

    if (data.parent.txtPecentage == 1 && Number(val) !== 100) {
      return false
    }
    return true
  }

  const checkTranchesValidity = (val: any, data: any) => {
    if (Number(data.parent.tgepercentage) === 100 && Number(val) > 1) {
      return false
    }
    return true
  }

  const isDigitInt = (val: any) => {
    if (Number(val) % 1 === 0) {
      return true
    }
    return false
  }

  const perPositiveValidate = (val: any) => {
    if (Number(val) >= 0) {
      return true
    }
    return false
  }

  const greaterPrev = (val: any, data: any) => {

    const id = Number(data.path.split("[")[1].split(']')[0]);
    if (id > 0) {
      if ((Number(val) > Number(state?.[id - 1]?.days ?? 0))) {
        return true
      } else {
        return false
      }
    }
    else {
      return true
    }
  }

  const validationSchema = Yup.object().shape({
    tgepercentage: Yup.string().required("This is required")
      .test("must Digit", "Value must be digit", digitValid)
      .test('validPer', "For Single Tranch, TGE Value must be 100", perValidate),
    txtPecentage: Yup.string().required("This is required")
      .test("must Digit", "Value must be digit", digitValid)
      .test("NotFloat", "Value must be Integer", isDigitInt)
      .test("greaterZero", "Value must be greater than 0", greaterZero)
      .test("checkTranches", "For 100% TGE, Tranche Value must be 1", checkTranchesValidity),
    txtCommonDays: Yup.string().required("This is required")
      .test("must Digit", "Value must be digit", digitValid)
      .test("NotFloat", "Value must be Integer", isDigitInt)
      .test("greaterZero", "Value must be greater than 0", greaterZero),
    customRange: Yup.array().required().of(Yup.object().shape({
      weightages: Yup.string().required("this is required")
        .test("must Digit", "Value must be digit", digitValid)
        .test("greaterZero", "Value must be greater than 0", greaterZero)
        .test("greaterZero", "Value must be positive", perPositiveValidate),
      days: Yup.string().required("this is required")
        .test("must Digit", "Value must be digit", digitValid)
        .test("NotFloat", "Value must be integer", isDigitInt)
        .test("greaterZero", "Value must be greater than 0", greaterZero)
        .test("greaterPrev", "Value must be greater than previous", greaterPrev)
    }))
  });

  const doneCreate = (values: any, commonPer: any, remainingPer: number) => {
    // onClose();
    // const initialData = { tgepercentage: '', txtPecentage: '', sameweightage: true, sameinterval: true, txtCommonDays: '', customRange: InputArray }

    let isValidDays = values.customRange.every((data: any) => {
      if (data.days) {
        return true
      }
      return false
    })

    let isValidWeight = values.customRange.every((data: any) => {
      if (data.weightages) {
        return true
      }
      return false
    })


    if ((Number(values.txtPecentage) === 1 && Number(values.tgepercentage) != 100) ||
      (values.sameinterval && (values.txtCommonDays === '' || Number(values.txtCommonDays) === 0)) ||
      (Number(values.txtPecentage) > 1 && Number(values.tgepercentage) == 100) ||
      (!values.sameinterval && !isValidDays) ||
      (!values.sameweightage && !isValidWeight)
    ) {
      setIsError(true);
      console.log("errir occurred");

      return;
    }

    let arrayOfWeightage: any = [];
    let arrayOfIntervals: any = [];
    if (values.sameweightage) {
      arrayOfWeightage[0] = Number(values.tgepercentage);
      for (let i = 1; i < Number(values.txtPecentage); i++) {
        arrayOfWeightage[i] = Number(commonPer);
      }
    } else {
      arrayOfWeightage[0] = Number(values.tgepercentage);
      for (let i = 1; i < Number(values.txtPecentage); i++) {
        arrayOfWeightage[i] = Number(values.customRange[i - 1]?.weightages ?? 0);
      }
    }

    if (values.sameinterval) {
      arrayOfIntervals[0] = 0;
      for (let i = 1; i < Number(values.txtPecentage); i++) {
        arrayOfIntervals[i] = Number(values.txtCommonDays) * i;
      }
    } else {
      arrayOfIntervals[0] = 0;
      for (let i = 1; i < Number(values.txtPecentage); i++) {
        arrayOfIntervals[i] = Number(values.customRange[i - 1]?.days ?? 0);
      }
    }

    values.sameweightage && (remainingPer = 0);

    if (
      arrayOfWeightage.length > 0 &&
      arrayOfIntervals.length > 0 &&
      remainingPer === 0 &&
      arrayOfIntervals.length == Number(values.txtPecentage) &&
      arrayOfWeightage.length == Number(values.txtPecentage)
    ) {

      setFormValues && setFormValues(values ?? {});
      setCardValues && setCardValues({ ...values, arrayOfWeightage, arrayOfIntervals, sameWeigth: commonPer?.toFixed(2) });
      onClose();
    } else {
      console.log("error");
      setIsError(true);
    }
  };

  const initialData = { tgepercentage: '', txtPecentage: '', sameweightage: true, sameinterval: true, txtCommonDays: '', customRange: InputArray }

  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} centered>
          <div className="modal-contents">
            {/* <div className="modal-title">
              <div className="modal-title__type">Card Type</div>
              <div className="modal-title__number">{cardIndex}</div>
            </div> */}

            <Formik
              initialValues={Object.keys(formValues ?? {}).length > 0 ? formValues : initialData}
              validateOnChange
              validateOnBlur
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
                console.log("form values are ::", values);
              }}
            // onSubmit={onSubmited}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue
                /* and other goodies */
              }) => {

                const commonPer = Number(values.txtPecentage) > 0 ?
                  Number(values.txtPecentage) == 1 ? 100 :
                    (100 - Number(values.tgepercentage)) / (Number(values.txtPecentage) - 1) :
                  0

                let remainingPer = 100 - Number(values.tgepercentage);
                values.customRange?.forEach((data: any, i: number) => {
                  if (values.customRange[i].weightages >= 0) {
                    remainingPer = remainingPer - Number(values.customRange[i]?.weightages ?? 0);
                  }
                })

                return (
                  <Form onSubmit={handleSubmit}>
                    <div className='createSection'>
                      <ModalHeader>
                        Define Vesting Period
                      </ModalHeader>
                      <ModalBody>
                        <div className='tgeTranche'>
                          <div>Number of tranches</div>
                          <div className='inputAndImg'>
                            <span>
                              <input
                                name="txtPecentage"
                                className="modal-form-item__input"
                                type="number"
                                value={values.txtPecentage}
                                onChange={(e: any) => {
                                  handleChange(e);
                                  InputArray = e.target.value > 0 ? [...Array(parseInt(e.target.value) - 1)] : [];

                                  InputArray.forEach((data: any, i: number) => {
                                    InputArray[i] = { weightages: '', days: '' }
                                  })

                                  setFieldValue("customRange", InputArray)
                                }}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage
                                name="txtPecentage"
                                render={(msg) => (
                                  <div className="form-item__err">{msg}</div>
                                )}
                              />
                            </span>
                            <span>
                              {/* <span></span> */}
                              {/* <span></span> */}

                            </span>
                          </div>
                        </div>
                        <div className='tgeTranche'>
                          <div>% Released on TGE</div>
                          <div className='inputAndImg'>
                            <span>
                              <input
                                className="modal-form-item__input"
                                name="tgepercentage"
                                type="number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.tgepercentage}
                              />
                              {/* <span> %</span> */}
                              <ErrorMessage
                                name="tgepercentage"
                                render={(msg) => (
                                  <div className="form-item__err">
                                    {msg}
                                  </div>
                                )}
                              />
                            </span>
                          </div>
                        </div>
                       
                        <div className='weightageIntervalsCheck'>
                          <div className='sameWI'>
                            {/* Same Weightage? */}
                            <span>
                              <span>Same Weightage?</span>

                              <Checkbox
                                className=""
                                checked={values.sameweightage}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="sameweightage"
                              ></Checkbox>
                            </span>
                            <hr />
                            {values.sameweightage &&
                              <div className='titleAndinput'>
                                <span>Weightage</span>
                                <span>
                                  <input
                                    name="txtCommonWeightage"
                                    type="number"
                                    className="modal-form-item__input"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={true}
                                    value={commonPer.toFixed(2)}
                                  />
                                  <ErrorMessage
                                    name="txtCommonWeightage"
                                    render={(msg) => (
                                      <div className="form-item__err">{msg}</div>
                                    )}
                                  />
                                  <span>%</span>
                                </span>
                              </div>
                            }
                          </div>
                          <div className='sameWI'>
                            <span>
                              <span>Same Intervals?</span>

                              <Checkbox
                                name="sameinterval"
                                className=""
                                onChange={handleChange}
                                onBlur={handleBlur}
                                checked={values.sameinterval}
                              ></Checkbox>
                            </span>
                            <hr />
                            {(values.sameinterval || Number(values.txtPecentage) == 1) &&
                              <div className='titleAndinput'>
                                <span>Interval (in Days)</span>
                                <span>
                                  <div style={{ marginLeft: '10px' }}>
                                    <input
                                      name="txtCommonDays"
                                      className="modal-form-item__input"
                                      type="number"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.txtCommonDays}
                                    />
                                    <ErrorMessage
                                      name="txtCommonDays"
                                      render={(msg) => (
                                        <div className="form-item__err">{msg}</div>
                                      )}
                                    />
                                  </div>
                                </span>

                              </div>
                            }
                          </div>
                        </div>
                        {
                          values.sameweightage && values.sameinterval && < div className='releasedEveryDays'>
                            <span>{commonPer ? commonPer?.toFixed(2) : 0}% </span>
                            released every
                            <span> {values.txtCommonDays ? values.txtCommonDays : 0} </span>days
                          </div>
                        }

                        {
                          (!values.sameweightage || !values.sameinterval) &&
                          <div className='allTranches'>
                            <div className="messageForWeightage">Remaining Weightage is {remainingPer.toFixed(2)}</div>

                            <FieldArray
                              name="customRange"
                              validateOnChange

                              render={arrayHelpers => {

                                return (
                                  <div style={{ display: 'flex' }}>
                                    {values.customRange.map((tranch: any, id: number) =>
                                      <div className='tranchBlock'>
                                        <div className='tranch'>Tranch {id + 1}</div>
                                        {
                                          !values.sameweightage && <>
                                            <input
                                              name={`customRange.${id}.weightages`}
                                              className="modal-form-item__input"
                                              type="number"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={values.customRange[id]?.weightages ?? ''}
                                            />
                                            <div className='daysOrPerc'>%</div>
                                            <ErrorMessage
                                              name={`customRange.${id}.weightages`}
                                              render={(msg) => {
                                                return (
                                                  <div className="form-item__err">{msg}</div>
                                                )
                                              }}
                                            />
                                          </>
                                        }
                                        {
                                          !values.sameinterval && <>
                                            <input
                                              name={`customRange.${id}.days`}
                                              type={'number'}
                                              className="modal-form-item__input"
                                              onBlur={handleBlur}
                                              onChange={(e) => {
                                                handleChange(e);
                                                let data = [...state];
                                                data[id] = { days: e.target.value }
                                                setState([...data])
                                              }}
                                              value={values.customRange[id]?.days ?? ''}
                                            />

                                            <div className='daysOrPerc'>Days</div>
                                            <ErrorMessage
                                              name={`customRange.${id}.days`}
                                              render={(msg) => (
                                                <div className="form-item__err">{msg}</div>
                                              )}
                                            />
                                          </>
                                        }
                                      </div>
                                    )}
                                  </div>
                                )
                              }}
                            />
                          </div>
                        }
                        {((remainingPer !== 0 || remainingPer < 0) && !values.sameweightage && isError) &&
                          <div className='error-message'>
                            Please select valid weightage
                          </div>
                        }
                      </ModalBody>
                      <ModalFooter>
                        <button onClick={onClose} style={{ color: 'black', backgroundColor: 'white' }}>
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          onClick={() => doneCreate(values, commonPer, remainingPer)}
                        >
                          DONE
                        </button>
                      </ModalFooter>
                    </div >
                  </Form>
                )
              }}
            </Formik>
          </div>
        </Modal>
      )}
    </>
  )
}

export default CardModal
