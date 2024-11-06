// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClinicaDental {

    // Estructura para almacenar la información del paciente
    struct Paciente {
        string nombre;                   // Nombre encriptado del paciente
        string profesion;                // Profesión encriptada del paciente
        uint edad;                       // Edad encriptada del paciente
        string tipoSangre;               // Tipo de sangre encriptado del paciente
        string[] alergias;               // Alergias encriptadas del paciente
        string hashDatosMedicos;         // Hash de los datos médicos encriptados off-chain
    }

    // Estructura para almacenar la información del dentista
    struct Dentista {
        string nombre;                   // Nombre encriptado del dentista
        string profesion;                // Profesión encriptada del dentista
        string telefono;                 // Teléfono encriptado del dentista
    }

    // Estructura para almacenar la información de la cita
    struct Cita {
        uint fecha;                      // Fecha de la cita (en timestamp)
        string motivo;                   // Motivo encriptado de la cita
        uint costoTotal;                 // Costo total de la cita (no encriptado)
        string observaciones;            // Observaciones encriptadas de la cita
        string hashDatosCita;            // Hash de los datos de la cita encriptados off-chain
    }

    // Instancias de las estructuras Paciente, Dentista y Citas
    Paciente private paciente;
    Dentista private dentista;
    Cita[] private citas;

    // Dirección del administrador del contrato (quien tiene permisos especiales)
    address private admin;
    // Mapeo para controlar el acceso del personal autorizado
    mapping(address => bool) private personalAutorizado;

    // Eventos para la auditoría y seguimiento de acceso y modificaciones
    event CitaAgregada(uint fecha, string motivo, uint costoTotal);
    event DatosModificados(string entidad, address usuario);
    event AccesoRegistrado(string entidad, address usuario, uint timestamp);

    // Constructor del contrato, inicializa los datos del paciente, dentista y permisos iniciales
    constructor(
        string memory _nombrePacienteEncriptado,
        string memory _profesionPacienteEncriptada,
        uint _edadPaciente,
        string memory _tipoSangreEncriptado,
        string[] memory _alergiasEncriptadas,
        string memory _hashDatosMedicosEncriptado,
        string memory _nombreDentistaEncriptado,
        string memory _profesionDentistaEncriptada,
        string memory _telefonoEncriptado
    ) {
        admin = msg.sender;  // Establece al creador del contrato como administrador
        // Asigna los valores iniciales de los datos del paciente y dentista
        paciente = Paciente(_nombrePacienteEncriptado, _profesionPacienteEncriptada, _edadPaciente, _tipoSangreEncriptado, _alergiasEncriptadas, _hashDatosMedicosEncriptado);
        dentista = Dentista(_nombreDentistaEncriptado, _profesionDentistaEncriptada, _telefonoEncriptado);
    }

    // Modificador que garantiza que solo el personal autorizado o el administrador pueda ejecutar la función
    modifier soloAutorizado() {
        require(personalAutorizado[msg.sender] || msg.sender == admin, "Acceso denegado: no autorizado");
        _;
    }

    // Función para cambiar el permiso de acceso de un usuario
    function cambiarPermisoAcceso(address _usuario, bool _permiso) public {
        require(msg.sender == admin, "Solo el admin puede cambiar permisos");  // Solo el administrador puede cambiar los permisos
        personalAutorizado[_usuario] = _permiso;  // Establece el nuevo estado de permiso para el usuario
        emit DatosModificados("PermisoAcceso", msg.sender);  // Emite un evento para auditoría
    }

    // Funciones para obtener los datos encriptados del paciente sin registrar acceso
    function getHashDatosPaciente() public view soloAutorizado returns (string memory) {
        return paciente.hashDatosMedicos;  // Devuelve el hash de los datos médicos del paciente
    }

    function getNombrePacienteEncriptado() public view soloAutorizado returns (string memory) {
        return paciente.nombre;  // Devuelve el nombre encriptado del paciente
    }
    
    function getProfesionPacienteEncriptada() public view soloAutorizado returns (string memory) {
        return paciente.profesion;  // Devuelve la profesión encriptada del paciente
    }
    
    function getEdadPacienteEncriptada() public view soloAutorizado returns (uint) {
        return paciente.edad;  // Devuelve la edad encriptada del paciente
    }
    
    function getTipoSangrePacienteEncriptado() public view soloAutorizado returns (string memory) {
        return paciente.tipoSangre;  // Devuelve el tipo de sangre encriptado del paciente
    }
    
    function getAlergiasPacienteEncriptadas() public view soloAutorizado returns (string[] memory) {
        return paciente.alergias;  // Devuelve las alergias encriptadas del paciente
    }

    // Funciones para registrar el acceso y obtener los datos encriptados del paciente
    function registrarAccesoNombrePaciente() public soloAutorizado returns (string memory) {
        emit AccesoRegistrado("Paciente.Nombre", msg.sender, block.timestamp);  // Registra el acceso al nombre del paciente
        return paciente.nombre;  // Devuelve el nombre encriptado
    }

    function registrarAccesoProfesionPaciente() public soloAutorizado returns (string memory) {
        emit AccesoRegistrado("Paciente.Profesion", msg.sender, block.timestamp);  // Registra el acceso a la profesión del paciente
        return paciente.profesion;  // Devuelve la profesión encriptada
    }

    function registrarAccesoEdadPaciente() public soloAutorizado returns (uint) {
        emit AccesoRegistrado("Paciente.Edad", msg.sender, block.timestamp);  // Registra el acceso a la edad del paciente
        return paciente.edad;  // Devuelve la edad encriptada
    }

    function registrarAccesoTipoSangrePaciente() public soloAutorizado returns (string memory) {
        emit AccesoRegistrado("Paciente.TipoSangre", msg.sender, block.timestamp);  // Registra el acceso al tipo de sangre del paciente
        return paciente.tipoSangre;  // Devuelve el tipo de sangre encriptado
    }

    function registrarAccesoAlergiasPaciente() public soloAutorizado returns (string[] memory) {
        emit AccesoRegistrado("Paciente.Alergias", msg.sender, block.timestamp);  // Registra el acceso a las alergias del paciente
        return paciente.alergias;  // Devuelve las alergias encriptadas
    }

    // Funciones para obtener los datos encriptados del dentista sin registrar acceso
    function getNombreDentistaEncriptado() public view soloAutorizado returns (string memory) {
        return dentista.nombre;  // Devuelve el nombre encriptado del dentista
    }
    
    function getProfesionDentistaEncriptada() public view soloAutorizado returns (string memory) {
        return dentista.profesion;  // Devuelve la profesión encriptada del dentista
    }
    
    function getTelefonoDentistaEncriptado() public view soloAutorizado returns (string memory) {
        return dentista.telefono;  // Devuelve el teléfono encriptado del dentista
    }

    // Función para agregar una nueva cita con información encriptada
    function agregarCita(uint _fecha, string memory _motivoEncriptado, uint _costoTotal, string memory _observacionesEncriptadas, string memory _hashDatosCitaEncriptado) public soloAutorizado {
        citas.push(Cita(_fecha, _motivoEncriptado, _costoTotal, _observacionesEncriptadas, _hashDatosCitaEncriptado));  // Agrega la cita al arreglo de citas
        emit CitaAgregada(_fecha, _motivoEncriptado, _costoTotal);  // Emite un evento para la auditoría
    }

    // Función para obtener una cita específica encriptada por índice sin registrar acceso
    function getCitaEncriptada(uint index) public view soloAutorizado returns (uint, string memory, uint, string memory, string memory) {
        require(index < citas.length, "Cita no existe");  // Asegura que el índice de la cita es válido
        Cita memory cita = citas[index];  // Obtiene la cita por su índice
        return (cita.fecha, cita.motivo, cita.costoTotal, cita.observaciones, cita.hashDatosCita);  // Devuelve la información encriptada de la cita
    }

    // Función de registro de acceso para obtener una cita específica
    function registrarAccesoCita(uint index) public soloAutorizado returns (uint, string memory, uint, string memory, string memory) {
        require(index < citas.length, "Cita no existe");  // Asegura que el índice de la cita es válido
        Cita memory cita = citas[index];  // Obtiene la cita por su índice
        emit AccesoRegistrado("Cita", msg.sender, block.timestamp);  // Registra el acceso a la cita
        return (cita.fecha, cita.motivo, cita.costoTotal, cita.observaciones, cita.hashDatosCita);  // Devuelve la información encriptada de la cita
    }

    // Función para obtener el número total de citas almacenadas
    function getNumeroDeCitas() public view returns (uint) {
        return citas.length;  // Devuelve el número total de citas almacenadas
    }
}
