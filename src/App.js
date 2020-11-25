import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import Axios from 'axios';

export const App = () => {
  const [currentPage, setCurrentPage] = useState('homePage');

  const [quantity, setQuantity] = useState(0);
  const [packagePrice, setPackagePrice] = useState(0);
  const [companions, setCompanions] = useState(0);

  const [isComplete, setIsComplete] = useState(false);

  const [comunaList, setComunaList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [lugarList, setLugarList] = useState([]);
  const [actividadList, setActividadList] = useState([]);

  const [regionId, setRegionId] = useState(0);
  const [comunaId, setComunaId] = useState(0);
  const [idLugar, setIdLugar] = useState(0);
  const [idActividad, setIdActividad] = useState(0);

  const [cardActivities, setCardActivities] = useState([]);

  // Login Form
  const [rutLogin, setRutLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Register Form
  const [nameClient, setNameClient] = useState('');
  const [motherLastName, setMotherLastName] = useState('');
  const [fatherLastName, setFatherLastName] = useState('');
  const [rutClient, setRutClient] = useState(0);
  const [passwordClient, setPasswordClient] = useState('');
  const [ageClient, setAgeClient] = useState(0);

  const getComunas = (id) => {
    axios.get('http://localhost:3001/comunas', { params: { id } }).then((res) => {
      setComunaList(res.data);
    });
  };

  const getRegiones = () => {
    axios
      .get('http://localhost:3001/regiones')
      .then((res) => {
        setRegionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLugar = (id) => {
    axios.get('http://localhost:3001/lugares', { params: { id } }).then((res) => {
      setLugarList(res.data);
    });
  };

  const getIdActividades = (id) => {
    axios.get('http://localhost:3001/pertenece', { params: { id } }).then((res) => {
      setActividadList(res.data);
    });
  };

  const postPaquete = (dias, precio, idsActividadList) => {
    axios.post('http://localhost:3001/paquete', { precio, dias, idsActividadList }).then((res) => {
      console.log(res);
    });
  };

  const postReserva = () => {
    axios.post('http://localhost:3001/reserva', { companions, rutLogin }).then((res) => {
      console.log(res);
    });
  };

  const postRegister = () => {
    Axios.post('http://localhost:3001/userRegister', {
      rut: rutClient,
      name: nameClient,
      appat: fatherLastName,
      apmat: motherLastName,
      password: passwordClient,
      edad: ageClient,
    }).then((response) => {
      console.log(response);
    });
  };

  const login = () => {
    return Axios.post('http://localhost:3001/login', {
      rut: rutLogin,
      password: passwordLogin,
    });
  };

  useEffect(() => {
    getRegiones();
  }, []);

  useEffect(() => {
    calcularPrecio(actividadList.length, quantity);
  }, [actividadList, quantity]);

  // useEffect debugger
  useEffect(() => {
    console.log(companions);
  }, [companions]);

  const onChangeRegion = ({ target }) => {
    setRegionId(target.value);
    getComunas(target.value);
  };

  const onChangeComuna = ({ target }) => {
    setComunaId(target.value);
    getLugar(target.value);
  };

  const onChangeLugar = ({ target }) => {
    setIdLugar(target.value);
    getIdActividades(target.value);
  };

  const onChangeActividad = ({ target }) => {
    setIdActividad(target.value);
  };

  const onChangeName = ({ target }) => {
    setNameClient(target.value);
  };

  const onChangeFatherLastName = ({ target }) => {
    setFatherLastName(target.value);
  };

  const onChangeMotherLastName = ({ target }) => {
    setMotherLastName(target.value);
  };

  const onChangeRut = ({ target }) => {
    setRutClient(target.value);
  };

  const onChangePassword = ({ target }) => {
    setPasswordClient(target.value);
  };

  const onChangeAge = ({ target }) => {
    var today = new Date();
    var birthDate = new Date(target.value);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    setAgeClient(age);
  };

  // useEffect(() => {
  //   console.log(nameClient, fatherLastName, motherLastName, rutClient, passwordClient, ageClient);
  // }, [nameClient, fatherLastName, motherLastName, rutClient, passwordClient, ageClient]);


  const onChangeRutLogin = ({ target }) => {
    setRutLogin(target.value);
  };

  const onChangePasswordLogin = ({ target }) => {
    setPasswordLogin(target.value);
  };
  const onChangeQuantity = (e) => setQuantity(e.target.value);

  const onChangeCompanions = (e) => setCompanions(e.target.value);

  const handlePaquete = () => {
    let ids = cardActivities.map((act) => act.id);
    postPaquete(quantity, packagePrice, ids);
    setCurrentPage('peopleDetails');
  };

  const handleReserva = () => {
    postReserva();
    setCurrentPage('paymentDetails');
  };

  const handleLogin = () => {
    login()
      .then((response) => {
        console.log('handleLogin',response);
        if (response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          setLoginStatus(response.data.RUT);
        }
        return response
      })
      .then((response) => {
        response.data.isAdmin ? setCurrentPage('registerActivitie') : setCurrentPage('packageForm');
      })
      .catch(setLoginError(true));
  };

  const handleRegister = () => {
    setCurrentPage('registerPage');
  };

  const handleSubmitRegister = () => {
    postRegister();
    setCurrentPage('homePage');
  };

  const addCard = (e) => {
    e.preventDefault();
    setIsComplete(true);
    const region = regionList.find((region) => Number(region.idREGION) === Number(regionId));
    const comuna = comunaList.find((comuna) => Number(comuna.idCOMUNA) === Number(comunaId));
    const lugar = lugarList.find((lugar) => Number(lugar.idLUGAR) === Number(idLugar));
    const actividad = actividadList.find(
      (activitie) => Number(activitie.idACTIVIDAD) === Number(idActividad),
    );
    let singleActivitie = {
      id: actividad.idACTIVIDAD,
      name: actividad.nombre,
      place: lugar.nombre,
      address: lugar.direccion,
      city: comuna.nombre,
      region: region.nombre,
    };
    setCardActivities([...cardActivities, singleActivitie]);
  };

  const createPackage = () => {
    setCurrentPage('bookingDetails');
  };

  const calcularPrecio = (cantidadActividades, cantidadPersonas) =>
    setPackagePrice(cantidadActividades * cantidadPersonas * 100000);

  const isAddDisabled = !(regionId && comunaId && idLugar && idActividad);
  const isCreateDisabled = !isComplete;
  const isBooking = !quantity;
  const isReadyToPay = !companions;
  const isRegister = ageClient < 18 ? true : false;

  if (currentPage === 'packageForm')
    return (
      <div className="my-1">
        <form className="container justify-content-center bg-dark text-white py-4">
          <h3>Formulario de Paquete</h3>
          {/* Select Región */}
          <div className="form-group">
            <label htmlFor="region">Seleccione una región</label>
            <select className="form-control" id="region" onChange={onChangeRegion} value={regionId}>
              <option hidden value="">
                Seleccione una región
              </option>
              {regionList.map((reg) => {
                return <option value={reg.idREGION}>{reg.nombre}</option>;
              })}
            </select>
          </div>
          {/* Select Comuna */}
          <div className="form-group">
            <label htmlFor="comuna">Seleccione una comuna</label>
            <select className="form-control" id="comuna" onChange={onChangeComuna} value={comunaId}>
              <option hidden value="">
                Seleccione una comuna
              </option>
              {comunaList.map((com) => {
                return <option value={com.idCOMUNA}>{com.nombre}</option>;
              })}
            </select>
          </div>
          {/* Select Lugar  */}
          <div className="form-group">
            <label htmlFor="lugar">Seleccione un lugar</label>
            <select className="form-control" id="lugar" onChange={onChangeLugar} value={idLugar}>
              <option hidden value="">
                Seleccione un lugar
              </option>
              {lugarList.map((lugar) => {
                return <option value={lugar.idLUGAR}>{lugar.nombre}</option>;
              })}
            </select>
          </div>
          {/* Select Actividad  */}
          <div className="form-group">
            <label htmlFor="actividad">Seleccione una actividad</label>
            <select
              className="form-control"
              id="actividad"
              onChange={onChangeActividad}
              value={idActividad}
            >
              <option hidden value="">
                Seleccione una actividad
              </option>
              {actividadList.map((act) => {
                return <option value={act.idACTIVIDAD}>{act.nombre}</option>;
              })}
            </select>
          </div>
          <div className="text-center">
            <button
              className="btn btn-light mt-3 w-75 p-3 "
              onClick={addCard}
              type="submit"
              disabled={isAddDisabled}
            >
              Agregar
            </button>
          </div>
        </form>
        <div className="card container mt-3 bg-dark text-white">
          <div className="card-header  mt-2 text-uppercase text-center">Paquete de Actividades</div>
          <ul className="list-group list-group-flush">
            {cardActivities.map((activitie) => {
              return (
                <div className="card text-left bg-white border border-dark text-dark my-2">
                  <div className="card-body text-center">
                    <div className="d-flex ml-5 mt-2">
                      <Icon.Bullseye size={30} />
                      <h5 className="ml-4 mt-2">
                        {activitie.name}, {activitie.place}
                      </h5>
                    </div>
                    <div className="d-flex ml-5 mt-3">
                      <Icon.GeoAltFill size={30} />
                      <h5 className="ml-4 mt-2">
                        {activitie.address}, {activitie.city}. {activitie.region}, Chile
                      </h5>
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
          <div className="text-center">
            <button
              className="btn btn-light my-3 w-75"
              onClick={createPackage}
              disabled={isCreateDisabled}
            >
              Crear paquete
            </button>
          </div>
        </div>
      </div>
    );
  else if (currentPage === 'bookingDetails')
    return (
      <div className="container border border-dark mt-3 bg-dark text-white">
        <h5 className="text-center border-bottom border-white mt-2">Detalle de Reserva</h5>
        <ul className="list-group list-group-flush">
          {cardActivities.map((activitie) => {
            return (
              <div className="card text-left bg-white border border-dark text-dark my-2">
                <div className="card-body text-center">
                  <div className="d-flex ml-5 ">
                    <Icon.Bullseye size={30} />
                    <h5 className="ml-4 mt-2">
                      {activitie.name}, {activitie.place}
                    </h5>
                  </div>
                  <div className="d-flex ml-5 ">
                    <Icon.GeoAltFill size={30} />
                    <h5 className="ml-4 mt-2">
                      {activitie.address}, {activitie.city}. {activitie.region}, Chile
                    </h5>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>

        <div className="form-group">
          <label>Cantidad de días</label>
          <select className="form-control" onChange={onChangeQuantity}>
            <option value="0">Seleccione una cantidad</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
        </div>
        <div className="justify-content-center text-center d-flex font-weight-bold">
          <h5 className="mr-3">Precio:</h5>
          <p>$ {packagePrice}</p>
        </div>
        <div className="text-center">
          <button
            className="btn btn-light row text-uppercase my-3 py-3 w-75"
            onClick={handlePaquete}
            disabled={isBooking}
          >
            <Icon.CheckSquare size={30} />
            Reservar
          </button>
        </div>
      </div>
    );
  else if (currentPage === 'peopleDetails')
    return (
      <div className="container bg-dark mt-4 text-white py-4 font-weight-bold">
        <div className="form-group ">
          <label className="mb-3">Cantidad de asistentes</label>
          <select className="form-control" onChange={onChangeCompanions}>
            <option value="0">Seleccione una cantidad</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
          <div className="text-center mt-3">
            <button
              className="btn btn-light  my-3 py-3 w-75"
              onClick={handleReserva}
              disabled={isReadyToPay}
            >
              <Icon.Bag size={30} />
              Ir a pagar
            </button>
          </div>
        </div>
      </div>
    );
  else if (currentPage === 'paymentDetails')
    return (
      <div className="container bg-dark mt-4 text-white py-4 font-weight-bold">
        <h5 className="text-center border-bottom border-white mt-2">Detalle de Reserva</h5>
        <ul className="list-group list-group-flush">
          <div className="card text-left bg-white border border-dark text-dark my-2">
            <div className="ml-5 py-4">
              <h5 className="ml-2">Actividades extremas: </h5>
              {cardActivities.map((activitie, index) => {
                return (
                  <h5 className="ml-4 mt-2">
                    {index + 1}. {activitie.name}, {activitie.place}
                  </h5>
                );
              })}
              <h5 className="ml-2">Cantidad de días: {quantity}</h5>
              <h5 className="ml-2">Precio unitario: ${packagePrice}</h5>
              <h5 className="ml-2">Cantidad de asistentes: {companions}</h5>
            </div>
            <h5 className="ml-2 text-center">Precio total: $ {companions * packagePrice}</h5>
          </div>
        </ul>
        <div className="text-center mt-3">
          <button className="btn btn-light  my-1 py-3 w-75" onClick={handleReserva}>
            <Icon.Cart4 size={30} />
            Pagar
          </button>
        </div>
      </div>
    );
  else if (currentPage === 'homePage')
    return (
      <div className="container bg-dark mt-4 text-white py-4 font-weight-bold">
        <div className="text-center">
          <h5>¡Bienvenido a Deportes extremos!</h5>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="rut">Ingrese su rut (Formato 111111111)</label>
          <input
            type="text"
            className="form-control"
            id="rut"
            placeholder="Ingrese su rut"
            onChange={onChangeRutLogin}
          ></input>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password">Ingrese su contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Ingrese su contraseña"
            onChange={onChangePasswordLogin}
          ></input>
        </div>
        { loginError ? (
          <div className="alert alert-danger" role="alert">
            Error al ingresar usuario y/o contraseña
          </div>
          ) : (
          null
        )  
      }
        <div className="text-center mt-3">
          <button className="btn btn-light  my-1 py-3 w-75" onClick={handleLogin}>
            Ingresar
          </button>
        </div>
        <div className="text-center mt-3">
          <h5>¿No tienes cuenta?</h5>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-light  my-1 py-3 w-75 " onClick={handleRegister}>
            Registrate
          </button>
        </div>
      </div>
    );
  else if (currentPage === 'registerPage')
    return (
      <div className="container bg-dark mt-4 text-white py-4 font-weight-bold">
        <div className="text-center">
          <h5>¡Registra tu usuario a Deportes extremos!</h5>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="name">Ingrese su nombre:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Ingrese su nombre"
            onChange={onChangeName}
          ></input>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="apat">Ingrese su apellido paterno:</label>
          <input
            type="text"
            className="form-control"
            id="apat"
            placeholder="Ingrese su apellido paterno"
            onChange={onChangeFatherLastName}
          ></input>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="amat">Ingrese su apellido materno:</label>
          <input
            type="text"
            className="form-control"
            id="amat"
            placeholder="Ingrese su apellido materno"
            onChange={onChangeMotherLastName}
          ></input>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="rut">Ingrese su rut (Formato 123456789):</label>
          <input
            type="text"
            className="form-control"
            id="rut"
            placeholder="Ingrese su rut"
            onChange={onChangeRut}
          ></input>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password">Ingrese su contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Ingrese su contraseña"
            onChange={onChangePassword}
          ></input>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="edad">Ingrese su edad:</label>
          <input
            type="date"
            className="form-control"
            id="edad"
            placeholder="0"
            onChange={onChangeAge}
          ></input>
        </div>
        { isRegister ? (
          <div className="alert alert-danger" role="alert">
            El usuario tiene que ser mayor de edad
          </div>
          ) : (
          null
        )  
      }
        <div className="text-center mt-3">
          <button
            className="btn btn-light  my-1 py-3 w-75"
            onClick={handleSubmitRegister}
            disabled={isRegister}
          >
            Registrar
          </button>
        </div>
      </div>
    );
  else if (currentPage === 'registerActivitie')
    return (
      <form className="container justify-content-center bg-dark text-white py-4 mt-3">
        <h3>Agregar Actividad</h3>
        {/* Select Región */}
        <div className="form-group">
          <label htmlFor="region">Seleccione una región</label>
          <select className="form-control" id="region" onChange={onChangeRegion} value={regionId}>
            <option hidden value="">
              Seleccione una región
            </option>
            {regionList.map((reg) => {
              return <option value={reg.idREGION}>{reg.nombre}</option>;
            })}
          </select>
        </div>
        {/* Select Comuna */}
        <div className="form-group">
          <label htmlFor="comuna">Seleccione una comuna</label>
          <select className="form-control" id="comuna" onChange={onChangeComuna} value={comunaId}>
            <option hidden value="">
              Seleccione una comuna
            </option>
            {comunaList.map((com) => {
              return <option value={com.idCOMUNA}>{com.nombre}</option>;
            })}
          </select>
        </div>
        {/* Select Lugar  */}
        <div className="form-group">
          <label htmlFor="lugar">Seleccione un lugar</label>
          <select className="form-control" id="lugar" onChange={onChangeLugar} value={idLugar}>
            <option hidden value="">
              Seleccione un lugar
            </option>
            {lugarList.map((lugar) => {
              return <option value={lugar.idLUGAR}>{lugar.nombre}</option>;
            })}
          </select>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="name">Nombre de la actividad:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Ingrese el nombre de la actividad"
            // onChange={}
          ></input>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="description">Descripción de la actividad:</label>
          <input
            type="text"
            className="form-control"
            id="description"
            placeholder="Ingrese descripción de la actividad"
            // onChange={onChangeName}
          ></input>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="type">Tipo:</label>
          <input
            type="text"
            className="form-control"
            id="type"
            placeholder="Ingrese el tipo de actividad"
            // onChange={onChangeName}
          ></input>
        </div>
        <div className="text-center">
          <button
            className="btn btn-light mt-3 w-75 p-3 "
            // onClick={addCard}
            type="submit"
            // disabled={isAddDisabled}
          >
            Agregar
          </button>
        </div>
      </form>
    );
};
